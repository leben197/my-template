<template>
  <div class="radio-group">
    <div class="outside" v-for="(label, value) in options" :key="value" @click="selectOption(value)"
      :class="{ selected: props.modelValue && props.modelValue === value }">
      <div class="content">{{ value }}: {{ label }} </div>
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps({
  modelValue: {
    type: String,
    default: 'a'
  },
  options: {
    type: Object,
    default: () => { }
  }
});


const emit = defineEmits(['update:modelValue']);


const selectOption = (option: string) => {

  emit('update:modelValue', option);
};
</script>

<style lang="scss" scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.radio-group .outside {
  display: flex;
  align-items: center;
  width: 589px;
  min-height: 91px;
  background: url(../assets/item.png) no-repeat;
  background-size: cover;
  background-position: 50% 55%;
  border: transparent;
  font-family: HanYiJiaShuJian;
  font-weight: bold;
  font-size: 28px;
  color: #272726;

  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-bottom: 25px;
  margin-left: 57px;
}

.radio-group .outside .content {
  margin-left: 60px;

  width: 432px;



  word-wrap: break-word; // 只对英文起作用，以单词作为换行依据。
  white-space: pre-wrap; //只对中文起作用，强制换行。
  text-align: justify; //css英文语句的两端对齐：
  text-justify: inter-ideograph;

}

.radio-group .outside.selected .content {

  // padding-top: 20px;
  width: 432px;
}

.radio-group .outside.selected {
  width: 589px;
  // min-height: 191px;
  // margin-left: 17px;
  // color: #FFB049;
  background: url(../assets/item-active.png) no-repeat;
  background-size: cover;
  background-position: 50% 55%;
}
</style>
