var dummy_reward_data = [ 
  {
    "count" : 1,
    "reward" : 10000
  }, 
  {
    "count" : 3,
    "reward" : 30000
  }, 
  {
    "count" : 5,
    "reward" : 50000
  }, 
  {
    "count" : 6,
    "reward" : 60000
  }, 
  {
    "count" : 7,
    "reward" : 70000
  }, 
  {
    "count" : 8,
    "reward" : 80000
  }
]

app = new Vue({
	el: '#binding',
	data() {
		return {
			data: []
		}
	},
	methods: {
		btnClick(btn) {
			if ($(`.expand-btn-${btn}`).text() === 'Expand') {
				$(`.expand-btn-${btn}`).text('Collapse')
				$(`.invited-${btn}`).css('display', 'table-row')
			} else {
				$(`.expand-btn-${btn}`).text('Expand')
				$(`.invited-${btn}`).css('display', 'none')
			}
		},
		fetchData(start_time, end_time) {
			fetch(`/getAnalyzed1?start_time=${start_time}&end_time=${end_time}`)
				.then(resp => resp.json())
        .then(json => json.data)
        .then(json => json.map(user => {
          user.referrals.map((ref, index) => {
            user.config.config.map(config => {
              if (config.count === index+1) {
                user.referrals[index].config = config
              }
            })
          })
          return user;
        }))
				.then(json => this.data = json)
				.catch(err => console.log(err))
		},
    save(config) {
      return fetch('/referrals', {
        method: 'PATCH', 
        body: JSON.stringify({data: config}),
        headers: {'Content-Type': 'application/json'}
      })
    },
    debounce_save(config) {
      this.debounced(config)
    },
    create_debounce() {
      this.debounced = _.debounce(this.save, 300)
    }
	},
	mounted() {
		let that = this

		var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
    	that.fetchData(start.valueOf(), end.valueOf())

      $('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
					'Today': [moment(), moment()],
					'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
					'Everything': [moment(0), moment()]
        }
    }, cb);

    cb(start, end);
	}
})