<template>
  <div class="counter-container">
    <h3>点击计数器</h3>
    <p class="count">{{ count }}</p>
    <div class="buttons">
      <button @click="increment" class="btn btn-primary">+ 增加</button>
      <button @click="decrement" class="btn btn-secondary">- 减少</button>
      <button @click="reset" class="btn btn-reset">重置</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
}
</script>

<style scoped>
.counter-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  color: white;
  text-align: center;
  margin: 20px 0;
}

.count {
  font-size: 48px;
  font-weight: bold;
  margin: 16px 0;
}

.buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #ffffff;
  color: #6366f1;
}

.btn-primary:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-reset {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}
</style>