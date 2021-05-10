document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.getElementById('calendar');

    const fullcalendar = new FullCalendar.Calendar(calendar, {
        initialView: 'timeGridWeek',
        events: {
            url: '/getMeetings',
            color: 'red',
            textColor: 'black',
            failure: function (e) {
                console.log(e)
            }
        }
    });
    fullcalendar.render();

    const selectAccounts = document.getElementById('account');

    selectAccounts.addEventListener('change', function () {
        let events = fullcalendar.getEventSources();

        
        for (let i = 0; i < events.length; i++) {
            const element = events[i];
            element.remove();
        }

        fullcalendar.addEventSource({
            url: `/getMeetings?account=${selectAccounts.value}`,
            color: 'red',
            textColor: 'black',
            failure: function (e) {
                console.log(e)
            }
        });
    });
});

