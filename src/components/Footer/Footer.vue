<template>
    <v-card
      class="flex"
      flat
      tile
    >
      <v-card-title class="primary" style='padding: 0px 16px;'>
        <strong class="subheading">Coded with <svg style='height:18px; width:18px; position: relative; top:3px;' xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" viewBox="0 0 512 512"><path fill="rgb(235, 87, 87)" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg> by Christian Busch & Andrew Tawking. Translated by the whole <a style="color:#fff; text-decoration: underline;" @click="contributorsDialog=true">NKN community</a>.</strong>

        <v-spacer></v-spacer>
        <v-btn
          class="mx-3"
          dark
          icon
          large
          target='_blank'
          v-html='twitter'
          href='https://twitter.com/nknX_org'
        >
        </v-btn>
        <v-btn
          class="mx-3"
          dark
          icon
          large
          target='_blank'
          v-html='trello'
          href='https://trello.com/b/qw9los55/nknx'
        >
        </v-btn>
        <v-btn
          class="mx-3"
          dark
          icon
          large
          v-html='docs'
          target='_blank'
          href='https://api.nknx.org/docs/'
        >
        </v-btn>
        <v-btn
          class="mx-3"
          dark
          icon
          large
          target='_blank'
          v-html='github'
          href='https://github.com/nknx-org'
        >
        </v-btn>
      </v-card-title>

      <v-card-actions style='background-color: #24397d; color: rgba(255,255,255,0.5)' class="justify-center">
        © Copyright 2018-2019 nknX - All Rights Reserved
      </v-card-actions>
      <v-dialog v-model="contributorsDialog" max-width="600">
        <v-card class='card-light'>
          <v-card-title class="headline">Our translators</v-card-title>
          <v-card-text>
              <p v-for="translator in translators" v-bind:key="translator.language">
                <img style="width:24px;position:relative;top:6px;" class="img-responsive mr-3" :src="'/static/flag-icons/'+translator.icon+'.svg'">
                <span>{{translator.language}}: </span>
                <span style="font-weight: bold;">{{translator.name}}</span>
              </p>
              <br>
              <p>Wanna help with translation? Contact us in official <a href="https://discord.gg/fvK2Egm" target="_blank">NKN Discord channel</a>.</p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
</template>

<script>
import feather from 'feather-icons';
export default {
  data() {
    return {
      contributorsDialog:false,
      translators:[
        {
          icon: "de",
          language: "Deutsch",
          name: "ChrisT"
        },
        {
          icon: "ru",
          language: "Русский",
          name: "lightmyfire"
        },
        {
          icon: "pl",
          language: "Polski",
          name: "Pomaranczowe"
        },
        {
          icon: "fr",
          language: "Français",
          name: "Bistory"
        },
        {
          icon: "fi",
          language: "Suomi",
          name: "anttu"
        },
        {
          icon: "zh",
          language: "简体中文",
          name: "Bruce"
        },
        {
          icon: "ja",
          language: "日本語",
          name: "katakoto"
        },
        {
          icon: "tr",
          language: "Türk",
          name: "ulimuli"
        },
        {
          icon: "vi",
          language: "Tiếng Việt",
          name: "secretcat"
        }
      ]

      
    };
  },
    computed: {
      github: function () {
          return feather.icons['github'].toSvg()
      },
      docs: function () {
          return feather.icons['file-text'].toSvg()
      },
      twitter: function () {
          return feather.icons['twitter'].toSvg()
      },
      trello: function () {
          return feather.icons['trello'].toSvg()
      }
  }
};
</script>
