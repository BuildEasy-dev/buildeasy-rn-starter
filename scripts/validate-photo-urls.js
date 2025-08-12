#!/usr/bin/env node
/* global __dirname */

const fs = require('fs');
const path = require('path');

// URL validation script for photos data
class PhotoURLValidator {
  constructor() {
    this.results = {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: [],
      details: [],
    };
  }

  // Extract all URLs from photos data
  extractURLsFromData() {
    const photosDataPath = path.join(__dirname, '../src/features/photos/data/photos-data.ts');

    try {
      const content = fs.readFileSync(photosDataPath, 'utf8');
      const urls = new Set();

      // Extract image URLs
      const imageUrlMatches = content.match(/image:\s*{[^}]*url:\s*'([^']+)'/g);
      if (imageUrlMatches) {
        imageUrlMatches.forEach((match) => {
          const url = match.match(/url:\s*'([^']+)'/)[1];
          urls.add(url);
        });
      }

      // Extract avatar URLs
      const avatarMatches = content.match(/avatar:\s*'([^']+)'/g);
      if (avatarMatches) {
        avatarMatches.forEach((match) => {
          const url = match.match(/avatar:\s*'([^']+)'/)[1];
          urls.add(url);
        });
      }

      // Extract URLs from ADDITIONAL_PHOTO_IDS array
      const additionalPhotoIds = content.match(/ADDITIONAL_PHOTO_IDS\s*=\s*\[([\s\S]*?)\]/)[1];
      const photoIds = additionalPhotoIds.match(/'([^']+)'/g);
      if (photoIds) {
        photoIds.forEach((id) => {
          const cleanId = id.replace(/'/g, '');
          // Generate both square and portrait versions
          urls.add(`https://images.unsplash.com/photo-${cleanId}?w=1080&h=1080&fit=crop`);
          urls.add(`https://images.unsplash.com/photo-${cleanId}?w=1080&h=1350&fit=crop`);
        });
      }

      return Array.from(urls);
    } catch (error) {
      console.error('Error reading photos data file:', error.message);
      return [];
    }
  }

  // Check if a URL is accessible
  async checkURL(url) {
    return new Promise((resolve) => {
      const https = require('https');
      const http = require('http');

      const client = url.startsWith('https') ? https : http;
      const timeout = 10000; // 10 second timeout

      const req = client.request(url, { method: 'HEAD', timeout }, (res) => {
        const isValid = res.statusCode >= 200 && res.statusCode < 400;
        resolve({
          url,
          valid: isValid,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'],
          error: null,
        });
      });

      req.on('error', (error) => {
        resolve({
          url,
          valid: false,
          statusCode: null,
          statusMessage: null,
          contentType: null,
          contentLength: null,
          error: error.message,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          valid: false,
          statusCode: null,
          statusMessage: null,
          contentType: null,
          contentLength: null,
          error: 'Request timeout',
        });
      });

      req.end();
    });
  }

  // Validate all URLs with concurrency control
  async validateAllURLs(urls, maxConcurrent = 10) {
    const chunks = [];
    for (let i = 0; i < urls.length; i += maxConcurrent) {
      chunks.push(urls.slice(i, i + maxConcurrent));
    }

    console.log(`🔍 Validating ${urls.length} URLs in batches of ${maxConcurrent}...`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`📦 Processing batch ${i + 1}/${chunks.length} (${chunk.length} URLs)`);

      const promises = chunk.map((url) => this.checkURL(url));
      const results = await Promise.all(promises);

      results.forEach((result) => {
        this.results.total++;
        this.results.details.push(result);

        if (result.valid) {
          this.results.valid++;
          console.log(`✅ ${result.url} - ${result.statusCode}`);
        } else {
          this.results.invalid++;
          this.results.errors.push(result);
          console.log(`❌ ${result.url} - ${result.error || result.statusCode}`);
        }
      });

      // Small delay between batches to be respectful to Unsplash
      if (i < chunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  // Generate detailed report
  generateReport() {
    const timestamp = new Date().toISOString();
    const validPercentage = ((this.results.valid / this.results.total) * 100).toFixed(2);

    const report = {
      timestamp,
      summary: {
        total: this.results.total,
        valid: this.results.valid,
        invalid: this.results.invalid,
        validPercentage: `${validPercentage}%`,
      },
      errors: this.results.errors,
      details: this.results.details,
    };

    // Save detailed report to file
    const reportPath = path.join(__dirname, 'photo-url-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return { report, reportPath };
  }

  // Print summary to console
  printSummary() {
    console.log('\n📊 URL Validation Summary');
    console.log('========================');
    console.log(`Total URLs checked: ${this.results.total}`);
    console.log(
      `Valid URLs: ${this.results.valid} (${((this.results.valid / this.results.total) * 100).toFixed(2)}%)`
    );
    console.log(
      `Invalid URLs: ${this.results.invalid} (${((this.results.invalid / this.results.total) * 100).toFixed(2)}%)`
    );

    if (this.results.errors.length > 0) {
      console.log('\n❌ Invalid URLs:');
      this.results.errors.forEach((error) => {
        console.log(`   • ${error.url}`);
        console.log(`     Error: ${error.error || `HTTP ${error.statusCode}`}`);
      });
    }
  }

  // Main validation function
  async validate() {
    console.log('🚀 Starting photo URL validation...\n');

    const urls = this.extractURLsFromData();
    if (urls.length === 0) {
      console.log('❌ No URLs found to validate');
      return;
    }

    await this.validateAllURLs(urls);

    const { report, reportPath } = this.generateReport();
    this.printSummary();

    console.log(`\n💾 Detailed report saved to: ${reportPath}`);

    return report;
  }
}

// Run the validator if called directly
if (require.main === module) {
  const validator = new PhotoURLValidator();
  validator.validate().catch((error) => {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  });
}

module.exports = PhotoURLValidator;
