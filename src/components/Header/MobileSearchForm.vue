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
            v-model="searchString"
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
      searchString: ""
    };
  },
  methods: {
    onClickSearch() {
      if(isNaN(parseFloat(this.searchString))){
				this.$router.push({ path: '/block/hash/'+this.searchString})
			}
			else{
				this.$router.push({ path: '/block/height/'+this.searchString})
			}
    }
  }
};
</script>

