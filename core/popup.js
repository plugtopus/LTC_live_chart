var lineChart;

function showChart() {
    var ctx = document.getElementById("container").getContext("2d");
    var config = {
        type: 'line',
        labels: [0],
        data: {
            datasets: [{
                label: "Цена",
                data: [0],
                backgroundColor: 'rgba(225, 225, 225)',
                borderColor: 'rgb(140, 140, 140)'
            }]
        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            legend: {
                display: false
            },
            tooltips: {
                mode: 'index',
                intersect: false,
                displayColors: false,
                callbacks: {
                    title: function(tooltipItems, data) {
                        var date = new Date(tooltipItems[0].xLabel);
                        var monthNames = [
                            "Январь", "Февраль", "Март",
                            "Апрель", "Май", "Июнь", "Июль",
                            "Август", "Сентябрь", "Октябрь",
                            "Ноябрь", "Декабрь"
                        ];
                        return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                    },
                    label: function(tooltipItems, data) {
                        return "$" + tooltipItems.yLabel;
                    }
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    gridLines: {
                        display: false
                    },
                    time: {
                        displayFormats: {
                            second: 'H:mm',
                            minute: 'H:mm',
                            quarter: 'MMM YYYY'
                        }
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 7,
                        callback: function(value, index, values) {
                            if (values.length == index + 1)
                                return "";
                            return value;
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return "$" + value.toFixed(2);
                        }
                    }
                }]
            },
        }
    };

    lineChart = new Chart(ctx, config);
    updateChart();
}

function updateChart() {
    $.getJSON('https://api.coinbase.com/v2/prices/' + $(".btn-primary").attr("id") + '-USD/historic?period=' + $(".btn-info").attr("id"), function(data) {
        var x = [];
        var y = [];
        for (var i = 0; i < data.data.prices.length; i++) {
            x[i] = new Date(data.data.prices[i].time);
            y[i] = parseFloat(data.data.prices[i].price);
        }
        lineChart.data.labels = x;
        lineChart.data.datasets[0].data = y;
        lineChart.update();
        $("#container").show();
    });
}

function updatePrice() {
    chrome.runtime.sendMessage({
        type: 'getPrices'
    }, function(response) {
        console.log(response);
        $("#LTC .price").text(response.LTC);
    });
}

showChart();

updatePrice();
setInterval(updatePrice, 5 * 60 * 1000);

$("[role='currency'] button").click(function() {
    if ($(this).hasClass("btn-primary"))
        return;
    $(".btn-primary").removeClass("btn-primary").addClass("btn-default");
    $(this).addClass("btn-primary");
    updateChart();
});

$("[role='timeline'] button").click(function() {
    if ($(this).hasClass("btn-info"))
        return;
    $(".btn-info").removeClass("btn-info").addClass("btn-default");
    $(this).addClass("btn-info");
    updateChart();
});