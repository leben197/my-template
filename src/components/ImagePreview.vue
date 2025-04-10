<template>
  <div class="image-preview-modal" v-if="visible" @click.self="closePreview">
    <div class="image-container">
      <img class="image-content" :src="url" @click.stop />
    </div>
    <div @click="handlePublish" class="button">前往发帖</div>
  </div>
</template>

<script setup>

import { ref } from 'vue';

const props = defineProps({
  imageUrls: {
    type: Array,
    required: false,
  },
});

const visible = ref(false);

const url = ref('');

const showPreview = ([value]) => {
  url.value = value;
  visible.value = true;
};

const emit = defineEmits(['close']);

const closePreview = () => {
  visible.value = false;
  emit('close');
};

const handlePublish = () => {
  wx.miniProgram.navigateTo({
    url: '/pages/go-post/go-post',
  });
};

defineExpose({
  showPreview,
  closePreview,
});
</script>

<style scoped>
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 999;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 200px;
  color: #fff;
  height: 80px;
  border-radius: 40px;
  background-color: #ff636d;
}

.image-container {
  max-width: 80%;
  max-height: 80%;
}

.image-content {
  width: 525px;
    height: 1048px;
}
</style>
