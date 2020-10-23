let ws, reqCounter = 0, placeBet, cashout, getUserBets, getRoundHistory, reconnecting = false;
let tempLatency, intervalLatency, connected, noConnection = 0, reconnectInterval = 2000;
let resendInterval;

function wsConnect() {
    ws = new WebSocket(
        'wss://crash.cup.games/ws?cid=00000000-0000-0000-0000-000000000000&token=500000&lng=en'
    );

    reqCounter = 0;
    const latency = () => {
        if(noConnection === 5) {
            clearInterval(resendInterval);
            return;
        }
        ws.send(
            JSON.stringify({
                name: 'latency',
                id: reqCounter++,
                data: {
                    client: new Date().getTime(),
                },
            })
        );
    };

    ws.onopen = function () {
        resendInterval = setInterval(latency, 1000);
        latency();
        ws.send(
            JSON.stringify({
                name: 'subscribe',
                data: {topic: `game/#`},
            })
        );
        ws.send(
            JSON.stringify({
                name: 'subscribe',
                data: {topic: `bets/#`},
            })
        );
        ws.send(
            JSON.stringify({
                name: 'round-history',
                id: 10,
                data: {
                    page: 0,
                    size: 5,
                },
            })
        );
    };

    getRoundHistory = () => {
      ws.send(
        JSON.stringify({
          name: 'round-history',
          id: reqCounter++,
          data: {
            page: 1,
            size: 20,
          },
        })
      );
    };

    placeBet = (amount, k, roundId) => {
        if (!amount) return;
        ws.send(
            JSON.stringify({
                name: 'bet',
                id: reqCounter++,
                data: {
                    amount: Number(amount),
                    roundId: roundId,
                    k: k ? Number(k) : 0,
                },
            })
        );
    };

    cashout = (roundId, betId) => {
        ws.send(
            JSON.stringify({
                name: 'cashout',
                id: reqCounter++,
                data: {
                    roundId: roundId,
                    betId: betId,
                },
            })
        );
    };

    getUserBets = (userId, page = 0, size = 20) => {
        ws.send(
            JSON.stringify({
                name: 'user-bets',
                id: userId,
                data: {
                    page,
                    size,
                },
            })
        );
    };
}

wsConnect();
