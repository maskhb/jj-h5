<script>
export default {
  mounted () {
    window.addEventListener('scroll', this.scrollFn)
  },
  methods: {
    scrollFn () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.scrollHandle()
      }, 200)
    },
    scrollHandle () {
      let scrollT = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollT >= document.body.offsetHeight - window.innerHeight) {
        if (this.dropDownEnd) {
          this.dropDownEnd()
        }
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollFn)
  },
  data () {
    return {
      timeout: null,
      isDropEnd: false
    }
  }
}
</script>
