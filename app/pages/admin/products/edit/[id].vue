<template>
  <main>
    <div class="app-container relative px-3 pt-4">
      <AdminSidebar/>
      <div>
        <div class="p-4 sm:ml-64 lg:ml-80">
          <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-7 mt-5">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl text-slate-900 font-semibold">Edit Product</h2>
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
                    <textarea v-model="product.description" placeholder="Product Description" class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Price Delivery</label>
                      <input v-model.number="product.price_delivery" placeholder="Price Delivery" type="number" step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Price Pickup</label>
                      <input v-model.number="product.price_pickup" placeholder="Price Pickup" type="number" step="0.01" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Category</label>
                    <select v-model="product.category" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                      <option value="">Please Select Category</option>
                      <option :value="cat.id" v-for="cat in categories" :key="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>

                  <div class="flex items-center gap-2 mt-4">
                    <input type="checkbox" v-model="product.isHighlighted" id="highlight" />
                    <label for="highlight" class="text-sm font-medium text-gray-700">Highlight Product</label>
                  </div>

                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Image</label>
                    <input type="file" @change="handleFileUpload" class="mt-1 block w-full border border-gray-300 rounded-md p-2"/>
                    <div v-if="product.imageUrl" class="mt-2">
                      <img :src="product.imageUrl" class="w-24 h-24 object-cover rounded"/>
                    </div>
                  </div>
                </div>

                <!-- Sub Menu Items -->
                <div class="space-y-4 mt-6">
                  <h3 class="text-lg font-semibold">Sub Menu Items</h3>
                  <div v-for="(item, index) in product.subMenu" :key="item.id" class="flex gap-2 items-center">
                    <input v-model="item.name" placeholder="Name" class="border border-gray-300 rounded-md p-2 flex-1"/>
                    <input v-model.number="item.price" placeholder="Price" type="number" step="0.01" class="border border-gray-300 rounded-md p-2 w-32"/>
                    <button type="button" @click="removeSubMenu(index)" class="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
                  </div>
                  <button type="button" @click="addSubMenu" class="bg-blue-500 text-white px-4 py-2 rounded">Add Sub Menu</button>
                </div>

                <div class="mt-6 mb-6">
                  <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded">Update Product</button>
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
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const productId = route.params.id

const product = reactive({
  name: '',
  description: '',
  price_delivery: 0,
  price_pickup: 0,
  category: '',
  image: null,       // File to upload
  imageUrl: '',      // Existing image path
  isHighlighted: '',      // Existing image path
  subMenu: []
})

const categories = ref([])

// Fetch categories
async function fetchCategories() {
  try {
    categories.value = await $fetch('/api/admin/category')
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// Fetch product data
async function fetchProduct() {
  try { 
    const data = await $fetch(`/api/admin/product/${productId}`)
    product.name = data.name
    product.description = data.description
    product.price_delivery = data.priceDelivery
    product.price_pickup = data.pricePickup
    product.category = data.categoryId
    product.imageUrl = data.image
    product.subMenu = data.subMenu || []
    product.isHighlighted = data.isHighlighted
  } catch (error) {
    console.error('Failed to fetch product:', error)
  }
}

function addSubMenu() {
  product.subMenu.push({ id: Date.now().toString(), name: '', price: 0 })
}

function removeSubMenu(index) {
  product.subMenu.splice(index, 1)
}

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  if (file) product.image = file
}

async function submitProduct() {
  try {
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price_delivery', product.price_delivery.toString())
    formData.append('price_pickup', product.price_pickup.toString())
    formData.append('category', product.category.toString())
    formData.append('isHighlighted', product.isHighlighted ? 'true' : 'false')
    formData.append('subMenu', JSON.stringify(product.subMenu))
    if (product.image) formData.append('image', product.image)

    await $fetch(`/api/admin/product/${productId}`, {
      method: 'PUT',
      body: formData
    })

    alert('Product updated successfully!')
    router.push('/admin/products')
  } catch (error) {
    console.error('Failed to update product:', error)
  }
}

onMounted(() => {
  fetchCategories()
  fetchProduct()
})
</script>
