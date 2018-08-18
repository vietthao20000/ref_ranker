const default_amount = 10000;
const CONFIG_PATH = '/configs'

app = new Vue({
  el: "#binding",
  data() {
    return {
      data: []
    }
  },
  methods: {
    changedConfig(element, disabled) {
      $(element).attr('disabled', disabled);
    },
    duplicateConfig(config) {
      var new_config = jQuery.extend(true, {}, config);
      new_config.created_time = Date.now()
      new_config.duplicated = true
      new_config.new = true
      this.data.push(new_config)
    },
    saveConfig(config) {
      var method;
      if (config.new || config.duplicated) {
        method = 'POST'
        delete config._id;
      } else {
        method = 'PUT'
      }

      config.duplicated = false;
      delete config.duplicated;

      return fetch(CONFIG_PATH, {
        method, 
        body: JSON.stringify({data: config}), 
        headers: {'Content-Type': 'application/json'}
      })
    },
    addGoal(config) {
      var new_goal = jQuery.extend(true, {}, config[config.length-1]);
      new_goal.reward = new_goal.reward + default_amount || 10000;
      new_goal.count = new_goal.count + 1 || 1;
      config.push(new_goal);
    },
    addConfig() {
      var new_config = {
        created_time: Date.now(),
        config: [],
        new: true
      }

      this.data.push(new_config);
    }
  },
  mounted() {
    fetch('/configs')
      .then(resp => resp.json())
      .then(json => json.data)
      .then(data => this.data = data)
  }
})