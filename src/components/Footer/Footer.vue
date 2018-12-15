<template>
    <v-card
      class="flex"
      flat
      tile
    >
      <v-card-title class="primary">
        <strong class="subheading">Coded with <svg style='height:18px; width:18px; position: relative; top:3px;'xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" viewBox="0 0 512 512"><path fill="rgb(235, 87, 87)" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg> by ChrisT & lightmyfire. Translated by the whole NKN community.</strong>

        <v-spacer></v-spacer>

        <v-btn
          class="mx-3"
          dark
          icon
          large
          v-html='docs'
          href='https://nknx.org/docs/'
        >
        </v-btn>
                <v-btn
          class="mx-3"
          dark
          icon
          large
          v-html='github'
          href='https://github.com/nknx-org'
        >
        </v-btn>
      </v-card-title>

      <v-card-actions style='background-color: #24397d' class="justify-center">
        © Copyright 2018 nknX - All Rights Reserved
      </v-card-actions>
    </v-card>
</template>

<script>
import feather from 'feather-icons';
export default {
  data() {
    return {
    };
  },
    computed: {
      github: function () {
          return feather.icons['github'].toSvg()
      },
      docs: function () {
          return feather.icons['file-text'].toSvg()
      }
  }
};
</script>
