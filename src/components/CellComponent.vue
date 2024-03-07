<template>
  <input
    v-if="isEditMode"
    @keyup.enter="onEnterPressed"
    class="cellInput"
    type="text"
    :value="rawValue"
    @input="onInput"
    v-on-click-outside="onCellOutsideClick"
  />
  <div v-else @click="onCellClick" class="cellLabel">
    {{ getEvaluatedValue }}
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { vOnClickOutside } from '@vueuse/components'
import { useCellsStore } from '@/stores/counter'

const props = defineProps(['cellId'])
const cellsStore = useCellsStore()
const isEditMode = ref(false)
let rawValue = ''

const onEditingFinished = () => {
  const inputValue = rawValue
  let evaluatedResult

  if (inputValue.startsWith('=')) {
    const { cellsId, operators } = parseFormula(inputValue.toUpperCase().substring(1))
    let needEvaluate = ''

    cellsId.forEach((cellId, index) => {
      const cellValue = cellsStore.getCellData(cellId).evaluatedValue
      needEvaluate += operators[index] ? `${cellValue}${operators[index]}` : `${cellValue}`
    })

    evaluatedResult = eval(needEvaluate)
  } else {
    evaluatedResult = inputValue
  }

  cellsStore.updateCellData(props.cellId, inputValue, evaluatedResult)
}
</script>
