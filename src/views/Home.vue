<template>
  <div class="row">
    <div class="col-md-3 col-sm-6 pb-2" >
      <v-select
        v-model="baseCurrency"
        :options="Object.keys(currencies)"
        placeholder="Ana Kur"
        dense
      >
      </v-select>
    </div>
    <div class="col-md-3 col-sm-6 pb-2">
      <v-select
        v-model="targetCurrency"
        :options="Object.keys(currencies)"
        placeholder="Hedef Kur"
        dense
      >
      </v-select>
    </div>

    <div class="col-md-3 col-sm-6 pb-2">
      <input 
        class="form-control"
        type="date"
        v-model="startDate" 
        @change="getRates"
      />
    </div>

    <div class="col-md-3 col-sm-6">
      <input 
        class="form-control"
        type="date"
        v-model="endDate" 
        @change="getRates"
      />
    </div>

    <div class="result" v-if="false">
      <input type="text" id="outputResult" >
    </div>

    <div class="text-center" v-if="isLoading">Yükleniyor</div>

    <div class="chart col-12">
      <div id="chart" style="width: 100%;">
        <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>


<script>

import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      currencies: [],
      rates: [],
      baseCurrency: 'USD',
      targetCurrency: 'TRY',
      selected: null,
      startDate: this.$moment().startOf('year').format('YYYY-MM-DD'),
      endDate: this.$moment().format('YYYY-MM-DD'),
      series: [],
      
      chartOptions: {
        chart: {
          type: 'area',
          height: 350,
          width: '100%',
          zoom: {
            enabled: false
          },
          defaultLocale: 'tr',
          locales: [{
            name: 'tr',
            options: {
              months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
              shortMonths: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
              days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
              shortDays: ['Pzr', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
              toolbar: {
                download: 'Download SVG',
                selection: 'Selection',
                selectionZoom: 'Selection Zoom',
                zoomIn: 'Zoom In',
                zoomOut: 'Zoom Out',
                pan: 'Panning',
                reset: 'Reset Zoom',
              }
            }
          }]
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        
        title: {
          text: 'Tarih Aralığına ait Döviz Kur Bilgisi',
          align: 'left'
        },
        subtitle: {
          text: '15 dakika gecikmeli çalışmaktadır.',
          align: 'left'
        },
        labels: [],
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          opposite: true
        },
        legend: {
          horizontalAlign: 'left'
        }
      }
    }
  },
  computed: {
    targetRates () {
      const keys = Object.keys(this.rates)
      const rows = keys.map((key) => {
        return {
          date: key,
          value: this.rates[key][this.targetCurrency]
        }
      })

      return rows.sort(this.dynamicSort('date'))
    },
    targetTestRates () {
      const keys = Object.keys(this.rates)
      const rows = keys.map((key) => {
        return {
          date: key,
          value: this.rates[key][this.baseCurrency]
        }
      })

      return rows.sort(this.dynamicSort('date'))
    }
  },
  methods: {
    getRates () {
      this.getRatesByDateRange()
    },

    getRatesByDateRange(){
      if (!this.startDate || !this.endDate || !this.baseCurrency || !this.targetCurrency) {
        alert("Lütfen boş seçenek bırakmayın.")
      }
      this.isLoading = true

      axios
        .get(`https://api.exchangeratesapi.io/history?start_at=${this.startDate}&end_at=${this.endDate}&base=${this.baseCurrency}`)
        .then(response => {
          this.rates = response.data.rates
          this.refreshChart()
        }).finally(() => {
          this.isLoading = false
        })
    },
    getCurrencies(){
      axios
      .get('https://api.exchangeratesapi.io/latest')
      .then(response => {
        this.currencies = response.data.rates
      })
    },
    refreshChart() {
      this.series = [{
        name: `${this.baseCurrency} - ${this.targetCurrency}`,
        data: this.targetRates.map((targetRate) => targetRate.value)
      }]
      this.chartOptions = {
        chart: {
          type: 'area',
          height: 350,
          width: '100%',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Tarih Aralığına ait Döviz Kur Bilgisi',
          align: 'left'
        },
        subtitle: {
          text: '15 dakika gecikmeli çalışmaktadır.',
          align: 'left'
        },
        labels: this.targetRates.map((targetRate) => targetRate.date),
        xaxis: {
          type: 'datetime',
          
        },
        yaxis: {
          opposite: true
        },
        legend: {
          horizontalAlign: 'left'
        }
      }
    },

    dynamicSort (property) {
      var sortOrder = 1;
      
      if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
      }
      
      return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
      }
    }
  },

  mounted() {
    this.getCurrencies();
    this.getRatesByDateRange()
  },

  watch: {
    baseCurrency () {
      this.getRates()
    },
    targetCurrency () {
      this.getRates()
    }
  }
} 
</script>

<style scoped>

.options{
  width: 50%;
  margin: 30px;
}
.row{
  background-color: white;
  padding: 30px 10px ;
}
.chart{
  padding: 20px;
  margin: 50px 0 15px 0;
} 

@media screen and (max-width: 1200px) {
  .row{
    padding: 10px 0 0 0;  
    position: relative;
  }
  .chart{
    display: inline-block;
    padding: 0;
    margin: 0;
    margin: 30px 0 0 0 ;
  }
}

@media screen and (min-height:1000px) {
  .row{
    margin: 50px 0 150px 0 ;
    padding: 50px 0 150px 0;  
    position: relative;
  }
}

</style>


