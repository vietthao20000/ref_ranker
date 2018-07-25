new Vue({
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
			fetch(`./getAnalyzed?start_time=${start_time}&end_time=${end_time}`)
				.then(resp => resp.json())
				.then(json => this.data = json)
				.catch(err => console.log(err))
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