//variable declration
const player=0;
const computer=1;
const defaultHeight=6;
const defaultWidth=7;
const defaultWinNumber=4;




//State
const gameState=
{
    height:defaultHeight,
    width:defaultWidth,
    board:[],
    winNumber:defaultWinNumber,
    players:[],
    currentTurn:0,
    phase:0
};




function resetGame(state,height,width,winNumber,player1,player2)
{

    if(Number(height)<=0)
    {
        state.height=defaultHeight;
    }
    else
    {
        state.height=height;
    }   
    
    if(Number(width)<=0)
    {
        state.width=defaultWidth;
    }
    else
    {
        state.width=width;
    }    

    
    if(Number(winNumber)<=0&&(state.winNumber<state.height||state.winNumber<state.width))
    {
        state.winNumber=defaultWinNumber;
    }
    else
    {
        state.winNumber=winNumber;
    }
    
    
    state.board=[];
    for(let i=0;i<state.height;i++)
    {
        state.board.push([]);
        for(let o=0;o<state.width;o++)
        {
            state.board[i].push(-1);
        }
    }
    state.players=[];
    if(!player1)
    {
        state.players.push({name:"Computer",type:computer});
    }
    else
    {
        state.players.push({name:player1,type:player});
    }
    if(!player2)
    {
        state.players.push({name:"Computer",type:computer});
    }
    else
    {
        state.players.push({name:player2,type:player});
    }
    state.currentTurn=getRandomInt(0,2);
    state.phase=0;
 
    changeBoard(state);
    gameTick(state,0,0);
    computerTurns(gameState);
}

//DOM Selectors
const boardElement=document.getElementById("gameBoard");
const player1InputElement=document.getElementById("player1Input");
const player2InputElement=document.getElementById("player2Input");
const heightInputElement=document.getElementById("heightInput");
const widthInputElement=document.getElementById("widthInput");
const winNumberInputElement=document.getElementById("winNumberInput");
const startGameButtonElement=document.getElementById("startGameButton");
const messageBoardElement=document.getElementById("messageBoard");



//DOM Manupulation Functions
function renderAll(state,message)
{
    renderBoard(state);
    renderMessage(state,message);
}

function changeBoard(state)
{
    let htmlString="";
    for(let i=0;i<state.height;i++)
    {
        htmlString+="<tr>";
        for(let o=0;o<state.width;o++)
        {
            htmlString+="<td></td>";
        }
        htmlString+="</tr>";
    }
    boardElement.innerHTML=htmlString;
}

function renderMessage(state,message)
{
    messageBoardElement.innerHTML=state.players[0].name+
    " vs. "+state.players[1].name+"<br> It is "+
    state.players[state.currentTurn].name+"'s turn.<br>"+message;
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
startGameButtonElement.addEventListener("click",function()
{
   resetGame(gameState,heightInputElement.value,widthInputElement.value,winNumberInputElement.value,player1InputElement.value,player2InputElement.value); 
});
boardElement.addEventListener("click",function(clickEvent)
{
    if(gameState.phase===0&&gameState.players[gameState.currentTurn].type===0&&clickEvent.target.nodeName==="TD")
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
            const row=pieceDrop(gameState,col);
            if(row>=0)
            {
                gameState.board[row][col]=gameState.currentTurn;  
                gameTick(gameState,row,col);
                computerTurns(gameState);
            }
            else
            {
                renderAll(gameState,"please choose a column with an empty space");
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
    if(row<0)//if invalid row then return -1
    {
        return -1;
    }
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
                if(horizontal===0)//line has to be vertical if no horizontal
                {
                    verticalLine+=lineCheck(state,row,col,horizontal,vertical);
                }
                else if(vertical===0)//line has to be horizontal if no vertical
                {
                    horizontalLine+=lineCheck(state,row,col,horizontal,vertical);
                }
                else if(horizontal*vertical===1)//line is diagonal up if vertical and horizontal match direction
                {
                    diagonalUpLine+=lineCheck(state,row,col,horizontal,vertical);
                }
                else//line is diagonal down if vertical and horizontal are diffrent signs
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
    while(col<state.width&&state.board[0][col]!==-1)
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
    if(horizontal===0&&vertical===0)//if we dont shift anywhere just return 0
    {
        return 0;
    }
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

function computerTurns(state)//take computer turns until it is a player's turn or game is over
{
    while(state.phase===0&&state.players[state.currentTurn].type===computer)
    {
        const col=computerChoice(state);
        const row=pieceDrop(state,col);
        state.board[row][col]=state.currentTurn;
        gameTick(state,row,col);
    }
}

function computerChoice(state)//returns column for computer to put piece into
{
    if(state.players[state.currentTurn]===0)//if a player calls this function just return
    {
        return;
    }
    let weights=//initalize to one spot to compare with others
    [
        {
            value:winCheck(state,pieceDrop(state,0),0),
            index:0
        }
    ];
    for(let i=1;i<state.width;i++)
    {
        const eval=winCheck(state,pieceDrop(state,i),i);
        if(eval>weights[0].value)//if we find a higher value only select from those
        {
            weights=   
            [
                {
                    value:eval,
                    index:i
                }
            ];
        }
        else if(eval===weights[0].value)//if we find a equal value add to list of valid moves
        {
            weights.push
            (
                {
                    value:eval,
                    index:i
                }
            );
        }
    }
    return weights[getRandomInt(0,weights.length)].index;//return column chosen to drop piece
}

function pieceDrop(state,col)
{
    let row=0;
    while(row<state.height&&state.board[row][col]===-1)//go until non empty space found
    {
        row++;
    }
    row--;//go back to empty space
    return row;//return row that the piece should be assigned to or -1 if invalid column
}

function turnChange(state)
{
    state.currentTurn=(state.currentTurn+1)%state.players.length;
}

function gameTick(state,row,col)
{
    if(winCheck(state,row,col)>=state.winNumber)
    {
        state.phase=1;
        renderAll(state,state.players[state.currentTurn].name+" wins!");
    }
    else if(tieCheck(state))
    {
        state.phase=1;
        renderAll(state,"Its a Tie! there is no more spaces to play.");
    }
    else
    {
        turnChange(state);
        renderAll(state,"");
    }
    
}
//BootStrapping
resetGame(gameState,defaultHeight,defaultWidth,defaultWinNumber,"Player 1")

//DebugTesting