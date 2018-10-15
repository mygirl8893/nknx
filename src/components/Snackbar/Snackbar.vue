<template>
  <v-snackbar v-model="show">
    {{message}}
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    watch: {
        snackbar: function () {
            var msg = this.$store.getters.snackbar;
            if (msg !== '') {
                this.show = true
                this.message = msg
                this.$store.dispatch("setSnackbar", '');
            }
        }
    },
    computed: {
        ...mapGetters({
            snackbar: 'snackbar'
        })
    },
  data () {
    return {
      show: false,
      message: ''
    }
  }
}
</script>