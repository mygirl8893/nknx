<template>
  <div class="mobile-search d-none">
    <v-btn v-on:click.native="open=true" flat small icon class="mobile-search-btn my-1 mx-3">
      <v-icon class="grey--text font-md">search</v-icon>
    </v-btn>
    <div class="search-form-wrap" v-bind:class="{ 'search-slide' : open }">
      <v-btn v-on:click.native="open=false" fab dark small class="close-btn">
        <v-icon dark>close</v-icon>
      </v-btn>
      <div class="d-flex align-center justify-center centered">
        <v-form>
          <v-text-field 
            dark
            v-model="search"
            prepend-icon="search"
            :placeholder="$t('message.search')"
            autocomplete="true"
            @click.stop="onClickSearch"
            color="white"
          >
          </v-text-field>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      open:false,
      search: ""
    };
  },
  mounted() {
    const mobSearchBtn = document.querySelector('.mobile-search-btn');
    console.log(mobSearchBtn)
    mobSearchBtn.onclick = function(event) {
      event.stopPropagation();
      console.log("open!");
      document.querySelector(".search-form-wrap").classList.add('search-slide');
    };
    document.querySelector(".close-btn").onclick = function(event) {
      event.stopPropagation();
      document.querySelector(".search-form-wrap").classList.remove('search-slide');
    };
    document.querySelector(".search-form-wrap").onclick =  function(event) {
      event.stopPropagation();
      document.querySelector(".search-form-wrap").classList.remove('search-slide');
    };
  },
  methods: {
    onClickSearch() {
      console.log("work");
    }
  }
};
</script>

