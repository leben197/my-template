import { ref, onMounted } from 'vue';

export function useBackgroundImageSwitch(imageUrl: string) {
  const backgroundImageUrl = ref('');

  const checkImageFormat = () => {
    const webpUrl = imageUrl.replace(/\.\w+$/, '.webp');
    const pngUrl = imageUrl.replace(/\.\w+$/, '.png');

    const img = new Image();
    img.src = webpUrl;
    img.onload = () => {
      backgroundImageUrl.value = `url('${webpUrl}')`;
    };
    img.onerror = () => {
      backgroundImageUrl.value = `url('${pngUrl}')`;
    };
  };

  onMounted(() => {
    checkImageFormat();
  });

  return { backgroundImageUrl };
}
