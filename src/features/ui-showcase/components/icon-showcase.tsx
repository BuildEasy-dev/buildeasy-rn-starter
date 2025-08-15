import { StyleSheet } from 'react-native';

import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

// Define icon categories and their included icons
const iconGroups = [
  {
    title: 'Navigation & Interface',
    icons: [
      'house',
      'house.fill',
      'chevron.left',
      'chevron.right',
      'chevron.up',
      'chevron.down',
      'line.3.horizontal',
      'xmark',
      'ellipsis',
      'plus',
      'plus.circle',
      'minus',
      'minus.circle',
      'magnifyingglass',
      'checkmark',
      'checkmark.circle',
      'arrow.left',
      'arrow.right',
      'arrow.up',
      'arrow.down',
      'arrow.clockwise',
    ] as IconSymbolName[],
  },
  {
    title: 'Social & Communication',
    icons: [
      'paperplane',
      'paperplane.fill',
      'envelope',
      'envelope.fill',
      'person',
      'person.fill',
      'person.crop.circle',
      'person.2',
      'person.3',
      'square.and.arrow.up',
      'square.and.arrow.down',
      'phone',
      'video',
      'message',
      'bubble.left',
      'bubble.right',
    ] as IconSymbolName[],
  },
  {
    title: 'Status & Actions',
    icons: [
      'star',
      'star.fill',
      'bookmark',
      'bookmark.fill',
      'heart',
      'heart.fill',
      'pencil',
      'pencil.circle',
      'trash',
      'trash.fill',
      'eye',
      'eye.slash',
      'flag',
    ] as IconSymbolName[],
  },
  {
    title: 'Media Controls',
    icons: [
      'play',
      'play.fill',
      'play.circle',
      'pause',
      'pause.fill',
      'stop',
      'forward.fill',
      'backward.fill',
      'speaker',
      'speaker.slash',
      'speaker.wave.1',
      'speaker.wave.2',
      'speaker.wave.3',
      'microphone',
      'microphone.slash',
      'headphones',
    ] as IconSymbolName[],
  },
  {
    title: 'Camera & Photos',
    icons: [
      'camera',
      'camera.fill',
      'camera.circle',
      'photo',
      'photo.fill',
      'photo.on.rectangle',
      'photo.stack',
      'square.stack',
      'film',
      'video.circle',
    ] as IconSymbolName[],
  },
  {
    title: 'Tools & Functions',
    icons: [
      'calendar',
      'calendar.circle',
      'clock',
      'timer',
      'stopwatch',
      'bell',
      'bell.slash',
      'lock',
      'lock.open',
      'lock.shield',
      'key',
    ] as IconSymbolName[],
  },
  {
    title: 'Text & Formatting',
    icons: [
      'textformat',
      'textformat.size',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'list.bullet',
      'list.number',
      'text.alignleft',
      'text.aligncenter',
      'text.alignright',
      'quote',
    ] as IconSymbolName[],
  },
  {
    title: 'Documents & Files',
    icons: [
      'doc',
      'doc.fill',
      'doc.text',
      'doc.richtext',
      'folder',
      'folder.fill',
      'archivebox',
      'tray',
    ] as IconSymbolName[],
  },
  {
    title: 'Device & System',
    icons: [
      'gear',
      'gear.circle',
      'slider.horizontal.3',
      'cpu',
      'externaldrive',
      'server',
      'wifi',
      'wifi.slash',
      'antenna.radiowaves.left.and.right',
    ] as IconSymbolName[],
  },
  {
    title: 'Weather & Nature',
    icons: [
      'sun',
      'sun.max',
      'moon',
      'moon.fill',
      'moon.stars',
      'cloud',
      'cloud.rain',
      'cloud.snow',
      'wind',
      'thermometer.sun',
      'snowflake',
    ] as IconSymbolName[],
  },
  {
    title: 'Transportation',
    icons: [
      'car',
      'car.fill',
      'bus',
      'tram',
      'bicycle',
      'airplane',
      'airplane.departure',
      'airplane.arrival',
      'ferry',
    ] as IconSymbolName[],
  },
  {
    title: 'Shopping & Finance',
    icons: [
      'creditcard',
      'banknote',
      'dollarsign.circle',
      'cart',
      'bag',
      'gift',
      'tag',
    ] as IconSymbolName[],
  },
  {
    title: 'Location & Maps',
    icons: [
      'location',
      'location.fill',
      'location.circle',
      'location.north',
      'location.slash',
      'map',
      'mappin.circle',
      'mappin.and.ellipse',
    ] as IconSymbolName[],
  },
  {
    title: 'Health & Fitness',
    icons: [
      'heart.circle',
      'heart.text.square',
      'figure.walk',
      'figure.run',
      'dumbbell',
    ] as IconSymbolName[],
  },
  {
    title: 'Entertainment & Gaming',
    icons: [
      'gamecontroller',
      'dice',
      'music.note',
      'music.note.list',
      'tv',
      'photo.tv',
    ] as IconSymbolName[],
  },
  {
    title: 'Security & Verification',
    icons: [
      'checkmark.seal',
      'checkmark.seal.fill',
      'xmark.seal',
      'exclamationmark.triangle',
      'exclamationmark.circle',
      'questionmark.circle',
      'info.circle',
    ] as IconSymbolName[],
  },
  {
    title: 'Business & Work',
    icons: [
      'building',
      'building.2',
      'briefcase',
      'chart.bar',
      'chart.pie',
      'chart.line.uptrend.xyaxis',
      'percent',
    ] as IconSymbolName[],
  },
  {
    title: 'Development & Code',
    icons: [
      'chevron.left.forwardslash.chevron.right',
      'curlybraces.square',
      'terminal',
      'hammer',
      'wrench',
      'screwdriver',
    ] as IconSymbolName[],
  },
  {
    title: 'Audio & Sound',
    icons: [
      'waveform',
      'waveform.path',
      'waveform.circle',
      'music.quarternote.3',
      'beats.headphones',
      'beats.earphones',
      'hifispeaker',
    ] as IconSymbolName[],
  },
  {
    title: 'Power & Battery',
    icons: [
      'battery.100',
      'battery.75',
      'battery.50',
      'battery.25',
      'battery.0',
      'bolt',
      'bolt.circle',
      'power',
    ] as IconSymbolName[],
  },
];

// Icon size variants
const sizes = [16, 24, 32];

/**
 * Icon component showcase
 * Displays different types, sizes and colors of IconSymbol components
 */
export function IconShowcase() {
  // Get theme colors
  const textColor = useThemeColor('text');
  const primaryColor = useThemeColor('tint');
  const borderColor = useThemeColor('borderColor');

  return (
    <ThemedView style={styles.container}>
      {/* Icon size examples */}
      <ThemedText type="h6" style={styles.firstSectionTitle}>
        Icon Sizes
      </ThemedText>
      <ThemedView style={styles.sizeContainer}>
        {sizes.map((size) => (
          <ThemedView key={size} style={styles.sizeItem}>
            <IconSymbol name="star.fill" size={size} color={primaryColor} />
            <ThemedText type="caption">{size}px</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      {/* Icon color examples */}
      <ThemedText type="h6" style={styles.sectionTitle}>
        Icon Colors
      </ThemedText>
      <ThemedView style={styles.row}>
        <ThemedView style={styles.colorItem}>
          <IconSymbol name="heart.fill" size={24} color={primaryColor} />
          <ThemedText type="caption">Primary</ThemedText>
        </ThemedView>
        <ThemedView style={styles.colorItem}>
          <IconSymbol name="heart.fill" size={24} color={textColor} />
          <ThemedText type="caption">Text</ThemedText>
        </ThemedView>
        <ThemedView style={styles.colorItem}>
          <IconSymbol name="heart.fill" size={24} color="#F44336" />
          <ThemedText type="caption">Red</ThemedText>
        </ThemedView>
        <ThemedView style={styles.colorItem}>
          <IconSymbol name="heart.fill" size={24} color="#4CAF50" />
          <ThemedText type="caption">Green</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Icon category examples */}
      {iconGroups.map((group) => (
        <ThemedView key={group.title} style={styles.groupContainer}>
          <ThemedText type="h6" style={styles.sectionTitle}>
            {group.title}
          </ThemedText>
          <ThemedView style={styles.iconsGrid}>
            {group.icons.map((iconName) => (
              <ThemedView key={iconName} style={styles.iconItem}>
                <ThemedView style={[styles.iconBox, { borderColor }]}>
                  <IconSymbol name={iconName} size={24} color={textColor} />
                </ThemedView>
                <ThemedText type="caption" style={styles.iconName}>
                  {iconName}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  firstSectionTitle: {
    marginTop: 0,
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    gap: 24,
  },
  sizeItem: {
    alignItems: 'center',
  },
  colorItem: {
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  groupContainer: {
    marginBottom: 16,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  iconItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconName: {
    textAlign: 'center',
    fontSize: 10,
    width: '100%',
  },
});
