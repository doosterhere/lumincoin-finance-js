export default {
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                'red',
                'green',
                'blue',
                'yellow',
                'gray',
                'orange',
                'lightblue',
                'pink',
                'purple',
                'brown',
                'limegreen',
                'saddlebrown',
                'midnightblue',
                'aquamarine',
                'black'
            ],
            hoverOffset: 4
        }]
    },
    config: {
        type: 'pie',
        data: this.data,
    }
}