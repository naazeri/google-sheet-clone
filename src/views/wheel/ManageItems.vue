<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="showAddDialog = true">Add Item</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" v-for="(item, index) in items" :key="item.name">
        <v-card>
          <v-card-title>
            {{ item.name }}
          </v-card-title>
          <v-card-subtitle> Chance: {{ item.chance }} </v-card-subtitle>
          <v-card-actions>
            <v-btn color="blue" @click="editItem(index)">Edit</v-btn>
            <v-btn color="red" @click="confirmDelete(index)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ currentItemIndex !== null ? 'Edit' : 'Add' }} Item</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Item Name" v-model="form.name" />
              </v-col>
              <v-col cols="12">
                <v-text-field label="Chance" type="number" v-model="form.chance" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" persistent max-width="300">
      <v-card>
        <v-card-title class="text-h5">Are you sure?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useWheelStore } from '@/stores/wheelStore'
import 'vuetify/styles'

export default {
  setup() {
    const wheelStore = useWheelStore()
    const showAddDialog = ref(false)
    const showDeleteDialog = ref(false)
    const currentItemIndex = ref(null)
    const form = ref({
      name: '',
      chance: 0
    })

    const items = wheelStore.items

    const editItem = (index) => {
      currentItemIndex.value = index
      form.value = { ...items[index] }
      showAddDialog.value = true
    }

    const confirmDelete = (index) => {
      currentItemIndex.value = index
      showDeleteDialog.value = true
    }

    const saveItem = () => {
      if (currentItemIndex.value !== null) {
        wheelStore.editItem(currentItemIndex.value, { ...form.value })
      } else {
        wheelStore.addItem({ ...form.value })
      }
      closeDialog()
    }

    const deleteItem = () => {
      wheelStore.removeItem(currentItemIndex.value)
      showDeleteDialog.value = false
      currentItemIndex.value = null
    }

    const closeDialog = () => {
      showAddDialog.value = false
      currentItemIndex.value = null
      form.value = { name: '', chance: 0 }
    }

    return {
      items,
      showAddDialog,
      showDeleteDialog,
      form,
      currentItemIndex,
      editItem,
      confirmDelete,
      saveItem,
      deleteItem,
      closeDialog
    }
  }
}
</script>
