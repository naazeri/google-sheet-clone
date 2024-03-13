<template>
  <div class="sheetContainer">
    <!-- <input type="text" class="activeCellPreview" v-model="cellsStore.currentCellRawValue" /> -->
    <table class="sheetTable">
      <tbody>
        <tr>
          <th></th>
          <AxisCell v-for="(item, index) in cellsStore.columnCount" :key="index">
            {{ numberToChar(index) }}
          </AxisCell>
        </tr>
        <tr v-for="(rowNumber, rowIndex) in cellsStore.rowCount" :key="rowIndex">
          <AxisCell>
            {{ rowNumber }}
          </AxisCell>
          <td
            v-for="(columnNumber, columnIndex) in cellsStore.columnCount"
            :key="columnIndex"
            class="column"
          >
            <CellItem :cellId="getCellId(numberToChar(columnIndex), rowNumber)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import CellItem from '@/components/CellItem.vue'
import AxisCell from '@/components/AxisCell.vue'
import { useCellsStore } from '@/stores/cell'
// import 'vuetify/styles'

const cellsStore = useCellsStore()
// const columnCount = ref(26)
// const rowCount = ref(50)

const numberToChar = (num) => {
  const division = Math.floor(num / 26)
  const reminder = Math.floor(num % 26)
  const char = String.fromCharCode(reminder + 97).toUpperCase()
  return division - 1 >= 0 ? numberToChar(division - 1) + char : char
}

const getCellId = (value1, value2) => `${value1}${value2}`
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.sheetContainer {
  position: relative;
  width: fit-content;
}

.sheetTable {
  border-spacing: 0;
}

.column {
  min-width: 100px;
  max-width: 100px;
  height: 25px;
  border: 1px solid #777;
}

.activeCellPreview {
  width: 100%;
  height: 100%;
  font-size: 16px;
  padding: 0;
  margin: 0;
  /* margin: 1px 1px; */
  border: 2px #777 solid;
}
</style>
