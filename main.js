document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('.table');
    const modal = document.getElementById('countdownModal');
    const timeRemainingEl = document.getElementById('timeRemaining');
    const closeButton = document.querySelector('.close-button');

    const months = [
        { name: 'January', days: 31 },
        { name: 'February', days: 28 },
        { name: 'March', days: 31 },
        { name: 'April', days: 30 },
        { name: 'May', days: 31 },
        { name: 'June', days: 30 },
        { name: 'July', days: 31 },
        { name: 'August', days: 31 },
        { name: 'September', days: 30 },
        { name: 'October', days: 31 },
        { name: 'November', days: 30 },
        { name: 'December', days: 31 },
    ];

    let dayCounter = 1;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    let currentDayOfYear = 0;
    for (let month = 0; month < currentMonth; month++) {
        currentDayOfYear += months[month].days;
    }
    currentDayOfYear += currentDate;

    let currentPopover = null;

    for (let month = 0; month < months.length; month++) {
        for (let day = 1; day <= months[month].days; day++) {
            const gridItem = document.createElement('p');
            gridItem.classList.add('grid-item');
            gridItem.textContent = dayCounter;

            const isClicked =
                localStorage.getItem(`clicked-${dayCounter}`) === 'true';

            if (dayCounter < currentDayOfYear) {
                // For past days, check if clicked and set color accordingly
                if (isClicked) {
                    gridItem.style.background = 'green';
                    gridItem.style.color = 'white';
                } else {
                    gridItem.style.background = 'red';
                    gridItem.style.color = 'white';
                }
            } else if (dayCounter === currentDayOfYear) {
                // Current day starts as blue if not clicked, changes to green if clicked
                if (isClicked) {
                    gridItem.style.background = 'green';
                    gridItem.style.color = 'white';
                } else {
                    gridItem.style.background = 'blue';
                    gridItem.style.color = 'white';
                }

                // Add click event for today's date
                gridItem.addEventListener('click', () => {
                    localStorage.setItem(`clicked-${currentDayOfYear}`, 'true');
                    gridItem.style.background = 'green';
                    gridItem.style.color = 'white';
                    alert(`Today is: ${months[month].name} ${day}`);
                    openModal(); // Open countdown modal
                });
            } else {
                // Disable clicks on future days
                gridItem.style.cursor = 'not-allowed';

                gridItem.addEventListener('click', () => {
                    if (currentPopover) {
                        currentPopover.remove();
                        currentPopover = null;
                    }

                    const container = document.querySelector('.container');
                    const popover = document.createElement('div');
                    popover.classList.add('my-popover');
                    const modalPop = document.createElement('p');
                    modalPop.textContent = "You can only click on today's date.";
                    popover.appendChild(modalPop);

                    container.appendChild(popover);

                    const rect = gridItem.getBoundingClientRect();
                    popover.style.position = 'absolute';
                    popover.style.top = `${rect.bottom + window.scrollY}px`;
                    popover.style.left = `${rect.left + window.scrollX}px`;

                    const closeButton = document.createElement('button');
                    closeButton.textContent = 'Close';
                    closeButton.classList.add('close-button');
                    closeButton.addEventListener('click', () => {
                        popover.remove();
                        currentPopover = null;
                    });
                    popover.appendChild(closeButton);

                    popover.style.display = 'block';
                    currentPopover = popover;
                });
            }

            table.appendChild(gridItem);
            dayCounter++;
        }
    }

    // At midnight, update current day color to red if not clicked
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    );
    const timeUntilMidnight = midnight - now;

    setTimeout(() => {
        const currentDayGridItem = table.querySelector(
            `.grid-item:nth-child(${currentDayOfYear})`
        );
        if (
            currentDayGridItem &&
            !localStorage.getItem(`clicked-${currentDayOfYear}`)
        ) {
            currentDayGridItem.style.background = 'red';
            currentDayGridItem.style.color = 'white';
        }
    }, timeUntilMidnight);

    function updateRemainingTime() {
        const now = new Date();
        const midnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        );
        const remainingTime = midnight - now;

        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        timeRemainingEl.textContent = `Time remaining today: ${hours}h ${minutes}m ${seconds}s`;
    }

    function openModal() {
        modal.style.display = 'block';
        updateRemainingTime();
        const interval = setInterval(updateRemainingTime, 1000);

        closeButton.addEventListener('click', () => {
            clearInterval(interval);
            modal.style.display = 'none';
        });
    }
});