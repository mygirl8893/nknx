<template>
  <div class="mobile-search d-none" style='height: 44px; width: 44px;'>
    <v-btn v-on:click.native="open=true" flat small icon class="mobile-search-btn my-1 mx-3">
      <span class="font-md" v-html="searchIcon"></span>
    </v-btn>
    <div class="search-form-wrap" v-bind:class="{ 'search-slide' : open }">
      <v-btn v-on:click.native="open=false" fab dark small class="close-btn">
        <v-icon dark>close</v-icon>
      </v-btn>
      <div class="d-flex align-center justify-center centered">
        <v-form>
          <v-text-field 
            dark
            v-model.trim="searchString"
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
import feather from 'feather-icons';

export default {
  data() {
    return {
      open:false,
      searchString: ""
    };
  },
  computed: {
    searchIcon: function () {
        return feather.icons['search'].toSvg()
    },
  },
  methods: {
    onClickSearch() {
      if (this.searchString[0] == "N" && this.searchString.length === 34){
        this.$router.push({ path: '/address/'+this.searchString})
      } 
      else if(this.searchString.length > 34){
        this.$router.push({ path: '/block/hash/'+this.searchString})
      }
      else{
        this.$router.push({ path: '/block/height/'+this.searchString})
      }
    }
  }
};
</script>

