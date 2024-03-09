import { defineStore } from 'pinia'

export const useWheelStore = defineStore({
  id: 'wheel',
  state: () => ({
    items: JSON.parse(localStorage.getItem('wheelItems')) || []
  }),
  actions: {
    addItem(item) {
      this.items.push(item)
      this.saveItems()
    },
    editItem(index, newItem) {
      this.items[index] = newItem
      this.saveItems()
    },
    removeItem(index) {
      this.items.splice(index, 1)
      this.saveItems()
    },
    saveItems() {
      localStorage.setItem('wheelItems', JSON.stringify(this.items))
    }
  }
})
