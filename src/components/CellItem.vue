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
// console.log('🚀 ~ props:', props.cellId)

const cellsStore = useCellsStore()
const { updateCellData } = cellsStore

const isEditMode = ref(false)
let rawValue = ''

const getEvaluatedValue = computed(() => {
  if (props.cellId in cellsStore.cellsData2) {
    return cellsStore.cellsData[props.cellId].evaluatedValue
  }
  return ''
})

const onCellClick = () => {
  isEditMode.value = true
  cellsStore.selectedCellId = props.cellId
}

const onCellOutsideClick = () => {
  isEditMode.value = false
  onEditingFinished()
}

const onEnterPressed = () => {
  isEditMode.value = false
  onEditingFinished()
}

const onInput = (event) => {
  rawValue = event.target.value

  if (rawValue.includes('\t')) {
    const columnValues = rawValue.split('\t')
    for (const columnValue of columnValues) {
      const rowValues = columnValue.split('\n')
      console.log(`${props.cellId}`)
    }
    console.log(JSON.parse(columnValues))
  } else {
    console.log(rawValue)
  }
}

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

  updateCellData(props.cellId, inputValue, evaluatedResult)
}

// const evaluate = (value, operation) => {
//   for (let i = 1; i < value.length; i++) {
//     const char = value[i]
//     console.log('🚀 ~ evaluate ~ char:', char)
//   }
//   const cellsName = value.substring(1, value.length)
//   const cellsId = cellsName.split(',')
//   let result

//   cellsId.forEach((cell_id, index) => {
//     if (index !== 0) {
//       const value = cellsStore.getCellData(cell_id)
//     } else {
//       // first item
//       result = cellsStore.getCellData(cell_id)
//     }
//   })

//   return result
// }

function parseFormula(formula) {
  const cellPattern = /[A-Z]+\d+/g
  const cellsId = formula.match(cellPattern) || []

  const operators = formula
    .split(/[A-Z]+\d+/)
    .filter(Boolean)
    .map((op) => op.trim())

  return {
    cellsId,
    operators
  }
}
</script>

<style>
.cellInput {
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding: 0;
  margin: 0;
  border: 0;
  font-family: tahoma;
}

.cellLabel {
  overflow: auto;
  width: 100%;
  height: 100%;
  line-height: 19px;
  padding: 2px;
  text-overflow: clip;
  white-space: nowrap;
}
</style>
