//ローカルストレージAPIの使用
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const vm = new Vue({
  el: '#app',

  data: {
    todos: [],
    options: [
      { value: -1, label: 'All'},
      { value: 0, label: 'Working'},
      { value: 1, label: 'Complete'}
    ],
    current: -1,
    showDeleteOverlay: false,
    toBeRemoved: null
  },

  computed: {
    computedTodos: function(){
      return this.todos.filter(function(el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },
    labels(){
      return this.options.reduce(function(a, b){
        return Object.assign(a, { [b.value]: b.label})
      }, {})
    }
  },

  watch: {
    todos: {
      handler: function(todos){
        todoStorage.save(todos)
      },
      //ネストしているデータの監視
      deep: true
    }
  },

  //ライフサイクルメソッド
  created(){
    this.todos = todoStorage.fetch()
  },

  methods: {
    //todoの追加
    doAdd: function(event, value){
      var comment = this.$refs.comment
      if(!comment.value.length){
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      })
      comment.value = ''
    },
    //状態変更
    doChangeState: function(item){
      item.state = item.state ? 0 : 1
    },
    //削除
    doRemove: function(item){
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    },
    //モーダルウィンドウを開く
    openDeleteModal: function(item){
      this.toBeRemoved = item
      this.showDeleteOverlay = true
      //nextTickでDOM生成後にfocusがあたるようになる（詳細不明）
      this.$nextTick(() => this.$refs.DeleteYes.focus())
    },
    //同閉じる
    closeDeleteModal: function(){
      this.toBeDelete = null
      this.showDeleteOverlay = false
    },
    //全削除
    deleteAll: function(){
      return
      //未定義
    }
  }
})