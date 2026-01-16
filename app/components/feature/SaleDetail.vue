<template>
  <div class="card bg-base-100 shadow-md p-6 space-y-6">
    <h2 class="text-lg font-semibold border-b pb-2">Detalhes da Venda</h2>

    <!-- Informações gerais -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <span class="text-sm text-gray-500">Código</span>
        <p class="font-medium">{{ sale.id }}</p>
      </div>

      <div>
        <span class="text-sm text-gray-500">Data</span>
        <p class="font-medium">{{ formattedDate }}</p>
      </div>

      <div v-if="sale.name_client">
        <span class="text-sm text-gray-500">Cliente</span>
        <p class="font-medium">{{ sale.name_client }}</p>
      </div>

      <div>
        <span class="text-sm text-gray-500">Total</span>
        <p class="font-semibold text-success">
          {{ formattedTotal }}
        </p>
      </div>
    </div>

    <!-- Itens da venda -->
    <div>
      <h3 class="font-semibold mb-2">Itens</h3>

      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>Produto</th>
            <th class="text-right">Qtd</th>
            <th class="text-right">Valor Unit.</th>
            <th class="text-right">Subtotal</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in sale.items" :key="item.product_id">
            <td>{{ item.product_name_snapshot }}</td>
            <td class="text-right">{{ item.quantity }}</td>
            <td class="text-right">
              {{
                item.unit_price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }}
            </td>
            <td class="text-right">
              {{
                (item.unit_price * item.quantity).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Resumo financeiro -->
    <div class="flex justify-center mt-4">
      <div class="w-full max-w-sm space-y-2 text-sm">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>
            {{
              subtotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }}
          </span>
        </div>

        <div v-if="props.sale.discount > 0" class="flex justify-between text-error">
          <span>
            Desconto
            <span v-if="discountPercentage">
              ({{ discountPercentage }}%)
            </span>
          </span>
          <span>
            -{{
              sale.discount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }}
          </span>
        </div>

        <div class="border-t pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span class="text-success">
            {{
              props.sale.total_value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Sale } from "~/types/interfaces/sale";

const props = defineProps<{
  sale: Sale;
}>();

const subtotal = computed(() =>
  props.sale.items.reduce((acc, item) => {
    return acc + item.unit_price * item.quantity
  }, 0)
)

const discountPercentage = computed(() => {
  if (subtotal.value === 0 || props.sale.discount === 0) return null

  return ((props.sale.discount / subtotal.value) * 100).toFixed(2)
})


const formattedDate = computed(() =>
  new Date(props.sale.date_sale).toLocaleString("pt-BR")
);

const formattedTotal = computed(() =>
  props.sale.total_value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
);
</script>
