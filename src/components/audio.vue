<template>
<em :class="{ checked: modelValue == value }"  @click="updateValue" ></em>
</template>

<script>
export default {
  methods: {
    updateValue () {
      this.$emit('input', this.value)
      this.$emit('on-change', this.value)
    }
  },
  model: {
    prop: 'modelValue'
  },
  props: {
    modelValue: {
      required: true
    },
    value: {
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
em{
  vertical-align:middle;
  width:20px;
  height:20px;
  border:1px solid #222222;
  display:inline-block;
  border-radius:20px;
  position:relative;
}
em.checked:after{
  position:absolute;
  content:'';
  display:inline-block;
  width:10px;
  height:10px;
  border-radius:10px;
  background:#F5A623;
  transform:translate(-50%, -50%);
  left:50%;
  top:50%;
}
em input{
  margin-left:50px;
}
</style>
