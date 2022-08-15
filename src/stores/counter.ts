import { defineStore } from 'pinia'

export enum scenes {
  Boot = 1,
  Os,
}

export const useGameStateStore = defineStore({
  id: 'game state',
  state: () => ({
    currentScene: scenes.Boot,
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2
  // },
  // actions: {
  //   increment() {
  //     this.counter++
  //   }
  // }
})
