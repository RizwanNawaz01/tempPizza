<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Product Create</h2>
              </div>

              <form @submit.prevent="submitProduct" class="space-y-6">

                <!-- Main Product Fields -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input v-model="product.name" placeholder="Product Name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea v-model="product.description" placeholder="Product Description"  class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Price Delivery</label>
                      <input v-model.number="product.price_delivery" placeholder="Price Delivery"    type="number" step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Price Pickup</label>
                      <input v-model.number="product.price_pickup" placeholder="Price Pickup"   type="number" step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Quantity</label>
                    <input v-model="product.qty" placeholder="Product Quantity" type="number" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Category</label>
                    <select v-model="product.category"  class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                      <option value="">Please Select Category</option>
                      <option  :value="cat.id" v-for="cat in categories" :key="cat.id">{{ cat.name }}</option>
                    </select> 
                  </div> 
                     <div>
                    <label class="block text-sm font-medium text-gray-700 pb-2">Highlight Product</label>
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox"  v-model="product.isHighlighted" id="highlight"  class="sr-only peer">
                    <div for="highlight" class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  </label> 
                  </div> 


                  <div>
                    <label class="block text-sm font-medium text-gray-700">Image</label>
                    <input   type="file" @change="handleFileUpload"  placeholder="Enter image URL" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                  </div>

                </div>

                <!-- Sub Menu Items -->
                <div class="space-y-4 mt-6">
                  <div class="flex gap-4 justify-between">
                    <h3 class="text-lg font-semibold">Sub Menu Items</h3>
                    <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox"  v-model="staticSubMenu" id="highlight"  class="sr-only peer">
                    <div for="highlight" class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                   <span class="ms-3 text-sm font-medium text-black">Static Menu</span>
                  </label> 
                  </div>

                  <div v-for="(item, index) in product.subMenu" :key="item.id" class="flex gap-2 items-center">
                    <input v-model="item.name" placeholder="Name" class="border border-gray-300 rounded-md p-2 flex-1"/>
                    <input v-model.number="item.price" placeholder="Price" type="number" step="0.01" class="border border-gray-300 rounded-md p-2 w-32"/>
                    <button type="button" @click="removeSubMenu(index)" class="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
                  </div>

                  <button type="button" @click="addSubMenu" class="bg-blue-500 text-white px-4 py-2 rounded">Add Sub Menu</button>
                </div>

                <div class="mt-6 mb-6">
                  <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Save Product</button>
                </div>

              </form>

            </div>   
          </div>
        </div>
      </div> 
    </div>  
  </main>
</template>

<script setup>
import { reactive,onMounted,ref, watch  } from 'vue'

const product = reactive({
  name: '',
  description: '',
  price_delivery: 0,
  price_pickup: 0,
  qty: 0,
  category: '',
  image: null,
  subMenu: []
})

const categories = ref([])
const staticSubMenu = ref(0)

// Static menu items preset
const staticItems = ref([])  

// Fetch dynamic submenu items
async function fetchStaticItems() {
  try {
    staticItems.value = await $fetch('/api/admin/product/submenu')
  } catch (error) {
    console.error('Failed to fetch submenu items:', error)
  }
}


function addSubMenu() {
  product.subMenu.push({ id: Date.now().toString(), name: '', price: 0 })
}

function removeSubMenu(index) {
  product.subMenu.splice(index, 1)
}
  

async function fetchCategories() {
  try {
    categories.value = await $fetch('/api/admin/category')
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}


function handleFileUpload(event) {
  const file = (event.target).files?.[0]
  if (file) product.image = file
}


onMounted(() => {
  fetchCategories()
  fetchStaticItems()
})

async function submitProduct() {
  try {
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price_delivery', product.price_delivery.toString())
    formData.append('price_pickup', product.price_pickup.toString())
    formData.append('qty', product.qty.toString())
    formData.append('category', product.category.toString())
    formData.append('subMenu', JSON.stringify(product.subMenu))
    formData.append('isHighlighted', product.isHighlighted ? 'true' : 'false')

    if (product.image) {
      formData.append('image', product.image)
    }

    const result = await $fetch('/api/admin/product', {
      method: 'POST',
      body: formData
    })

    alert('Product saved successfully!')
    Object.assign(product, { name:'', description:'', price_delivery:0, price_pickup:0, category:'', image:null, subMenu:[] })
  } catch (error) {
    console.error('Failed to save product:', error)
  }
}


watch(staticSubMenu, (val) => {
  if (val) {
    product.subMenu = [...staticItems.value]
  } else {
    product.subMenu = []
  }
})
</script>
