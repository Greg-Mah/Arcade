//State
const player=0;
const computer=1;


const gameState=
{
    height:6,
    width:7,
    board:[],
    players:[],
    currentTurn:0
};




function resetGame(state,height,width,player1,player2)
{
    state.height=height;
    state.width=width;
    state.board=[];
    for(let i=0;i<height;i++)
    {
        state.board.push([]);
        for(let o=0;o<width;o++)
        {
            state.board[i].push(2);
        }
    }
    state.players=[];
    state.players.push({name:player1,type:player})
    if(player2==="")
    {
        player2="Computer";
        state.players.push({name:player2,type:computer})
    }
    else
    {
        state.players.push({name:player2,type:player})
    }
    state.currentTurn=getRandomInt(0,1);
 
}

//DOM Selectors
const boardElement=document.getElementById("gameBoard");



//boardElement.style.backgroundColor="#FF0000";

//DOM Manupulation Functions
function renderAll(state)
{
    renderBoard(state);
}

function renderBoard(state)
{
    for(let i=0;i<state.height;i++)
    {
        for(let o=0;o<state.width;o++)
        {
            const TDElement=boardElement.children[i].children[o];
            if(state.board[i][o]===0)
            {
                TDElement.className="red";
            }
            else if(state.board[i][o]===1)
            {
                TDElement.className="yellow";
            }
        }
    }
}

//Event Listeners
boardElement.addEventListener("click",function(clickEvent)
{
    if(clickEvent.target.nodeName==="TD")
    {
        const childrenArray=clickEvent.target.parentElement.children;
        let col=0;
        while(childrenArray[col]!==clickEvent.target&&col<childrenArray.length)
        {
            col++;
        }
        if(col>=childrenArray.length)
        {
            console.log("error out of bounds child");
        }
        else
        {
            const row =pieceDrop(gameState,col);
            if(row>=0)
            {
                gameState.board[row][col]=gameState.currentTurn;
                
                console.log(winCheck(gameState,row,col));
                tieCheck(gameState)
                turnChange(gameState);
                renderAll(gameState);
            }
            else
            {
                console.log("please choose a column with an empty space");
            }
        }
    }
}
);
//Support Functions

function getRandomInt(min,max)
{
    return Math.floor(Math.random()*Math.abs(max-min))+min;
}


//
function winCheck(state,row,col)//check whenever you place a piece
{
    let diagonalUpLine=1;//diagonal bottom left to top right,
    let diagonalDownLine=1; //diagonal bottom right to top left,
    let horizontalLine=1;// horizontal left to right
    let verticalLine=1;//vertical bottom to top,
    for(let vertical=-1;vertical<=1;vertical++)
    {
        for(let horizontal=-1;horizontal<=1;horizontal++)
        {
            if(!(horizontal===0&&(vertical===0||vertical===-1)))//only check in valid directions
            {
                if(horizontal===0)
                {
                    verticalLine+=lineCheck(state,row,col,horizontal,vertical);
                }
                else if(vertical===0)
                {
                    horizontalLine+=lineCheck(state,row,col,horizontal,vertical);
                }
                else if(horizontal*vertical===1)
                {
                    diagonalUpLine+=lineCheck(state,row,col,horizontal,vertical);
                }
                else
                {
                    diagonalDownLine+=lineCheck(state,row,col,horizontal,vertical);
                }
            }
        }
    }
    let max=1;//find max value of lines
    if(diagonalUpLine>max)
    {
        max=diagonalUpLine;
    }
    if(diagonalDownLine>max)
    {
        max=diagonalDownLine;
    }
    if(horizontalLine>max)
    {
        max=horizontalLine;
    }
    if(verticalLine>max)
    {
        max=verticalLine;
    }
    return max;
}

function tieCheck(state)
{
    let col=0;
    while(col<state.width&&state.board[0][col]!==2)
    {
        col++;
    }
    if(col>=state.width)
    {
        return true;
    }
    else
    {
        return false;
    } 
}
function lineCheck(state,row,col,horizontal,vertical)
{
    let length=0;
    let currentRow=row;
    let currentCol=col;
    currentRow+=vertical;
    currentCol+=horizontal;
    while(currentRow>=0&&currentRow<state.height&&//check if in row
        currentCol>=0&&currentCol<state.width&&//check if in col
        state.board[currentRow][currentCol]===state.currentTurn)//check if matching player
    {
        length++;//advance length of current line
        
        //shift to next position to check
        currentRow+=vertical;
        currentCol+=horizontal;
    }
    return length;
}

function pieceDrop(state,col)
{
    let row=0;
    while(row<state.height&&state.board[row][col]===2)//go until non empty space found
    {
        row++;
    }
    row--;//go back to empty space
    return row;//return row that the piece should be assigned to or -1 if invalid column
}

function turnChange(state)
{
    state.currentTurn=(state.currentTurn+1)%2;
}

//BootStrapping
resetGame(gameState,6,7,"me")

//DebugTesting
const testBoard1=
[
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1],
];
const testBoard2=
[
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0],
    [0,0,0,0,1,0,0],
    [0,0,0,0,0,1,0],
    [0,0,0,0,0,0,1],
];
const testBoard3=
[
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0],
    [0,0,0,1,0,0,0],
    [0,0,0,1,0,0,0],
    [0,0,0,1,0,0,0],
];
const testBoard4=
[
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1],
    [0,0,0,0,0,1,0],
    [0,0,0,0,1,0,0],
    [0,0,0,1,0,0,0],
];

console.log(boardElement);
