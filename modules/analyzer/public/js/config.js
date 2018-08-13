const default_amount = 10000;

let dummy_config = [
  {
    timestamp: 1533945600000,
    config: [
      {
        // 0
        "next": 2,
        "reward": null
      },
      {
        // 1
        "next": 2,
        "reward": null
      },
      {
        // 2
        "next": 4,
        "reward": 50000
      },
      {
        // 3
        "next": 4,
        "reward": null
      },
      {
        // 4
        "next": 6,
        "reward": 60000
      },
      {
        // 5
        "next": 6,
        "reward": null
      },
      {
        // 6
        "next": 8,
        "reward": 80000
      },
      {
        // 7
        "next": 8,
        "reward": null
      },
      {
        // 8
        "next": 10,
        "reward": 150000
      },
      {
        // 9
        "next": 10,
        "reward": null
      },
      {
        // 10
        "next": 11,
        "reward": 200000
      }
    ]
  },
  {
    timestamp: 1533945900000,
    config: [
      {
        // 0
        "next": 2,
        "reward": null
      },
      {
        // 1
        "next": 2,
        "reward": null
      },
      {
        // 2
        "next": 4,
        "reward": 50000
      },
      {
        // 3
        "next": 4,
        "reward": null
      },
      {
        // 4
        "next": 6,
        "reward": 60000
      },
      {
        // 5
        "next": 6,
        "reward": null
      },
      {
        // 6
        "next": 8,
        "reward": 80000
      },
      {
        // 7
        "next": 8,
        "reward": null
      },
      {
        // 8
        "next": 10,
        "reward": 150000
      },
      {
        // 9
        "next": 10,
        "reward": null
      },
      {
        // 10
        "next": 13,
        "reward": null
      },
      {
        // 11
        "next": 13,
        "reward": null
      },
      {
        // 12
        "next": 13,
        "reward": null
      },
      {
        // 13
        "next": 13,
        "reward": 250000
      }
    ]
  }
]

app = new Vue({
  el: "#binding",
  data() {
    return {
      data: dummy_config
    }
  },
  methods: {
    changedConfig(element) {
      $(element).attr('disabled', false);
    },
    duplicateConfig(config) {
      var new_config = jQuery.extend(true, {}, config);
      new_config.timestamp = Date.now()
      new_config.duplicated = true
      this.data.push(new_config)
    },
    saveConfig(config) {
      config.duplicated = false;
      delete config.duplicated;
    },
    addGoal(config) {
      var new_goal = jQuery.extend(true, {}, config[config.length-1]);
      new_goal.reward += default_amount;
      new_goal.next += 1;
      config.push(new_goal);
    },
    addConfig() {
      var new_config = {
        timestamp: Date.now(),
        config: [{
          next: 1,
          reward: default_amount
        }]
      }

      this.data.push(new_config);
    }
  }
})