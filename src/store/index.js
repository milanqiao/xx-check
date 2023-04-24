import { createStore } from 'vuex'
import { getLocalStorage, setLocalStorage } from '../untils'

// 创建一个新的 store 实例
export default  createStore({
  state () {
    return {
      checkList: getLocalStorage('checkList') || []
    }
  },
  mutations: {
    checkList (state, list) {
      // 先进性数据持久化，防止页面刷新丢失数据
      setLocalStorage('checkList', list)
      state.checkList = list
    }
  },
  getters: {
    currentTask: state => id => {
      return state.checkList.find(todo => todo.id == id)
    },
    nextTask: state => id => {
      // 改造当前 checkList 为链表结构
      let checkList = state.checkList.reduce((acc, cur, index, self) => {
        return [
          ...acc,
          {
            id: cur.id,
            prev: self[index - 1],
            data: cur,
            next: self[index + 1],
          }
        ]
      }, [])
      let current = checkList.find(todo => (todo.id == id))
      return current.next ? current.next.id : null
    },
  }
})