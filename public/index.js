
 //Creating function to create the operatorId select element
 async function funcName1(url){
    const response = await fetch(url);
    var data = await response.json();
    const selectColumn = document.querySelector('#select-column');
    data.forEach(option => {
      const newOption = document.createElement('option');
      newOption.value = option.OperatorId;
      newOption.text = option.Travels+ " - " +option.OperatorId;
      selectColumn.add(newOption);
       })
       const options = Array.from(selectColumn.options);
      console.log(options);

      selectColumn.addEventListener("onkeyup", (event) => {
        const inputValue = event.target.value;
        const sortedOptions = options.sort((a, b) => {
          return a.text.localeCompare(b.text);
        });

        selectColumn.innerHTML = "";
        sortedOptions.forEach((option) => {
          if (option.text.includes(inputValue)) {
            selectColumn.appendChild(option);
          }
        });
      });
    }
  funcName1( "http://localhost:3001/api/operators");

  //Creating function to create Bus-Type Select element
  const operatorTable = document.getElementById("#select-column");
  async function funcName2(url){
    const response = await fetch(url);
    var data = await response.json();
    const selectColumn = document.querySelector('#bus-type');
    data.forEach(option => {
      const newOption = document.createElement('option');
      newOption.value = option.Id;
      newOption.text = option.FormattedString;
      selectColumn.add(newOption);
        })
  }
  funcName2( "http://localhost:3001/api/bustype/");

  

  const selectElement = document.getElementById('select-column');
  const selectTable=document.querySelector('#table-row');
  var data;
  
  //change event so that i can append operator's in table when i change operator in select
  selectElement.addEventListener('change', () => {
    data=null;
    //making table empty when changing the operator
    selectTable.innerHTML="";
    var selectedOperatorId = selectElement.value;
    console.log(selectedOperatorId);
    
    //calling the vendor API after passing operator id to it.
    var url="http://localhost:3001/api/vendor/seatLayout?operatorId=" + selectedOperatorId;
    //table create start
    async function tableCreate(url){
      console.log(url);
        var response = await fetch(url);
        if(response){ 
          data = await response.json();

          //table headers
          const row= document.createElement("tr");
          const colh1=document.createElement("th");
          colh1.textContent="index";
          const colh2=document.createElement("th");
          colh2.textContent="vendorid";
          const colh3=document.createElement("th");
          colh3.textContent="vseatlayoutid";
          const colh4=document.createElement("th");
          colh4.textContent="VBusType";
          row.appendChild(colh1);
          row.appendChild(colh2);
          row.appendChild(colh3);
          row.appendChild(colh4);
          selectTable.appendChild(row);
          var i=1;
          //for each object inside the response append every row to table
          data.forEach(row => {
          const newRow = document.createElement("tr");
          const col1 = document.createElement("td");
          col1.textContent =i;  i=i+1;
          const col2 = document.createElement("td");
          col2.textContent = row.vendorid;
          const col3 = document.createElement("td");
          col3.textContent = row.vseatlayoutid;
          const col4 = document.createElement("td");
          col4.textContent = row.VBusType;
          newRow.appendChild(col1);
          newRow.appendChild(col2);
          newRow.appendChild(col3);
          newRow.appendChild(col4);
          selectTable.appendChild(newRow);
        });
       };
    }
    //table create end
   tableCreate(url); 
  });

  //event listener when i click on a particular operator in the table
  const layout = document.querySelector('#seat-layout');
  selectTable.addEventListener("click", (event) => {
       // Check if the clicked element is a table row
       //making layout table content empty when clicked on diffrent seatlayoutid
       layout.innerHTML="";
      if (event.target.nodeName === "TD" && event.target.parentNode.nodeName === "TR")
        {
          var dummydata=data;

          //fetching data from the table when clicked on a particular row
          const row = event.target.parentNode;
          const id= row.cells[0].textContent;
          const vendorid = row.cells[1].textContent;
          const vseatlayoutid = row.cells[2].textContent;
          const bustype=row.cells[3].textContent;

          // const selectvendor=document.getElementById('vendor-id');
          // selectvendor.textContent='V busType :'+bustype;
          if(dummydata!=null){
            if(dummydata[id-1].seatlayout._seatMap){
              //fetching seatlayout json file when click on a particular row
              const seatlayoutdata=dummydata[id-1].seatlayout._seatMap;
              
              //creating a 20*20 table 
              for(let y=0;y<20;y++){
                const row=document.createElement('tr');
                for(let x=0;x<20;x++){
                  //creating and setting default properties of a cell.
                  const cell=document.createElement('td');
                  cell.colSpan=1;
                  cell.rowSpan=1;
                  cell.style.backgroundColor='white';
                  cell.classList.add('seat-cell');
                  cell.addEventListener('dragstart', dragStart);
                  cell.addEventListener('dragover', dragOver);
                  cell.addEventListener('drop', drop);
                  cell.draggable=true;
                  cell.style.width='10px';
                  cell.style.height='10px';
                  //check if a particular postion of seat is present in seatlayout data or not
                 const seat=seatlayoutdata.find(seat=> (x ===seat.Pos.XPos && y === seat.Pos.YPos));
                 if(seat){
                  cell.setAttribute('id', seat.Name);
                  cell.setAttribute('data-seat-type', seat.Type);
                  cell.textContent=seat.Name;
                  cell.colSpan=seat.Size.Height;
                  cell.rowSpan=seat.Size.Width;
                  //if seat-height is 2 move 2 positions ahead instead of 1.
                   if(seat.Size.Height==2){
                      x=x+1;
                   }
                   if(seat.Type=="Seater")
                   cell.style.backgroundColor='LimeGreen'
                   else cell.style.backgroundColor='SpringGreen'
                 }
                 else{
                  //setting class of empty cell
                  cell.setAttribute('id','empty-cell');
                  cell.setAttribute('data-seat-type',null);
                 }
                 row.appendChild(cell)
                }
                layout.appendChild(row);

                //function's to drag and drop the seat's
                function dragStart(event) {
                  const draggedCell =event.target.closest('td');
                  event.dataTransfer.setData('id', draggedCell.id);
                }
                
                function dragOver(event) {
                  event.preventDefault();
                  //event.style.opacity=0.5;
                }
                
                //drop function
                function drop(event) {
                    event.preventDefault();

                    //deep cloned tagret and source cell

                    var targetCell = event.target.closest('td');
                    var clonedtargetcell=targetCell.cloneNode(true);
                    var targetAttributes=clonedtargetcell.attributes;
                    const draggedCellId = event.dataTransfer.getData('id')
                    var sourceCell = document.getElementById(draggedCellId);
                    var sourceContent = sourceCell.innerHTML;
                    var clonedsourcecell = sourceCell.cloneNode(true);
                    var sourceAttributes=clonedsourcecell.attributes;
                    
                    // Copy the target cell's content and attributes to the source cell
                    sourceCell.innerHTML = targetCell.innerHTML;
                    for (var i = 0; i < targetCell.attributes.length; i++) {
                      var attr = targetAttributes[i];
                      sourceCell.setAttribute(attr.name, attr.value);
                    }

                    // Copy the source cell's content and attributes to the target cell
                    targetCell.innerHTML = sourceContent;
                    for (var i = 0; i < sourceAttributes.length; i++) {
                      var attr = sourceAttributes[i];
                      targetCell.setAttribute(attr.name, attr.value);
                    }
              }
            }
            }
            const configureButton=document.getElementById('download-button');
              configureButton.addEventListener("click", function() {
              // Create an array to store the seat data
              var seatData = [];
              var xpos=0;
              var ypos=0;
              // Traverse the table rows
              for (var i = 0; i < 32; i++) {
                var row1 = layout.rows[i];
                if(row1){
                  for (var j = 0; j < 32; j++) {
                    var cell = row1.cells[j];
                    if(cell){
                       // Check if the cell has a seat ID attribute
                      console.log(cell);
                      var seatId = cell.getAttribute("id");
                      console.log("seat id is",seatId);
                      if (seatId!='empty-cell') {
                        // Get the X and Y coordinates of the cell
                        if(cell.getAttribute('data-seat-type')!='Seater'){
                            var xCoord =xpos;
                            var yCoord=ypos;
                            xpos=xpos+2;
                        }
                        else{
                            var xCoord=xpos;
                            var yCoord=ypos;
                            xpos=xpos+1;
                        }
                        // Add the seat data to the array
                        seatData.push({
                          seatId: seatId,
                          xCoord: xCoord,
                          yCoord: yCoord
                        });
                      }
                      else{
                        xpos=xpos+1;
                      }
                    }
                  }
                  xpos=0;
                  ypos=ypos+1;
                }                          
              }

              // Convert the seat data array to JSON and download it as a file
              var jsonData = JSON.stringify(seatData);
              var filename = "seat_data.json";
              var blob = new Blob([jsonData], {type: "application/json"});
              var link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = filename;
              link.click();
            });
          };
        }
  });
//end click event 
  
  
  
  
 




  
  
  
  
  
  