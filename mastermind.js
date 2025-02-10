        const colors = ['', 'red', 'blue', 'green', 'purple', 'yellow', 'white'];
        const colorsAnswers = ['red', 'blue', 'green', 'purple', 'yellow', 'white'];
        let answerCells = [];

        document.getElementById("startGame").addEventListener("click", function () {
            createTable();
            createColorRow();
        });

        function createTable() {
            const table = document.getElementById("table");
            table.innerHTML = ""; 

            for (let rows = 0; rows < 10; rows++) {
                let headerCell = document.createElement("div");
                headerCell.classList.add("grid-item", "header");
                headerCell.textContent = `Guess ${rows + 1}`;
                table.appendChild(headerCell);

                let rowSelects = [];

                for (let columns = 0; columns < 4; columns++) {
                    let cell = document.createElement("div");
                    cell.classList.add("grid-item");

                    let select = document.createElement("select");
                    select.dataset.row = rows;
                    select.dataset.column = columns;

                    colors.forEach(color => {
                        let option = document.createElement("option");
                        option.value = color;
                        option.textContent = color;
                        select.appendChild(option);
                    });

                    if (rows !== 0) {
                        select.disabled = true;
                        select.classList.add("disabled");
                    }

                    select.addEventListener("change", function () {
                        cell.style.backgroundColor = this.value === "" ? "" : this.value;
                        checkRowCompletion(rows);
                    });

                    rowSelects.push({ select, cell });
                    cell.appendChild(select);
                    table.appendChild(cell);
                }

                let approvalCell = document.createElement("div");
                approvalCell.classList.add("grid-item");
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.disabled = true;
                checkbox.dataset.row = rows;

                checkbox.addEventListener("change", function () {
                    if (checkbox.checked) {
                        revealAnswerColors(rowSelects);
                    }
                });

                approvalCell.appendChild(checkbox);
                table.appendChild(approvalCell);
            }
        }

        function createColorRow() {
            const colorRowGrid = document.getElementById("colorRowGrid");
            colorRowGrid.innerHTML = "";

            let headerCell = document.createElement("div");
            headerCell.classList.add("grid-item", "header");
            headerCell.textContent = "Answer";
            colorRowGrid.appendChild(headerCell);

            answerCells = [];

            for (let columns = 0; columns < 4; columns++) {
                let cell = document.createElement("div");
                cell.classList.add("grid-item", "hidden-answer");

                let randomColor = colorsAnswers[Math.floor(Math.random() * colorsAnswers.length)];
                cell.dataset.correctColor = randomColor;
                cell.style.backgroundColor = "black";
                cell.textContent = "";
                answerCells.push(cell);

                colorRowGrid.appendChild(cell);
            }
        }

        function revealAnswerColors(rowSelects) {
            rowSelects.forEach(({ select, cell }, index) => {
                const guessedColor = select.value;
                const answerCell = answerCells[index];

                if (guessedColor === answerCell.dataset.correctColor) {
                    answerCell.style.backgroundColor = answerCell.dataset.correctColor;
                    answerCell.textContent = answerCell.dataset.correctColor;
                    answerCell.classList.remove("hidden-answer");
                } else {
                    const isColorInAnswerRow = answerCells.some(answer => answer.dataset.correctColor === guessedColor);
                    if (isColorInAnswerRow) {
                        cell.style.setProperty("--flash-color", guessedColor);
                        cell.classList.add("flash");
                    }
                }
            });
        }

        function checkRowCompletion(rowIndex) {
            const selects = document.querySelectorAll(`select[data-row="${rowIndex}"]`);
            const allSelected = Array.from(selects).every(select => select.value !== "");

            if (allSelected) { 
                enableNextRow(rowIndex);
            }
        }

        function enableNextRow(rowIndex) {
            if (rowIndex < 9) {
                const nextRowSelects = document.querySelectorAll(`select[data-row="${rowIndex + 1}"]`);
                nextRowSelects.forEach(select => {
                    select.disabled = false;
                    select.classList.remove("disabled");
                });
            }

            const approvalCheckbox = document.querySelector(`input[type="checkbox"][data-row="${rowIndex}"]`);
            if (approvalCheckbox) {
                approvalCheckbox.disabled = false;
            }
        }
