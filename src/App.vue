<template>
  <div id="app">
    <h1>JSON Editor</h1>
    <textarea v-model="jsonData" placeholder="Enter JSON here..."></textarea>
    <button @click="formatJson">Format JSON</button>
    <pre>{{ formattedJson }}</pre>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      jsonData: '',
      formattedJson: ''
    };
  },
  methods: {
    formatJson() {
      try {
        this.formattedJson = JSON.stringify(JSON.parse(this.jsonData), null, 2);
      } catch (e) {
        this.formattedJson = 'Invalid JSON';
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
textarea {
  width: 80%;
  height: 200px;
  margin: 20px 0;
}
button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
pre {
  text-align: left;
  margin: 20px auto;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  width: 80%;
}
</style>