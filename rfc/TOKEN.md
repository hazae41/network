# Network Token

Let's monetize any service for free

## TLDR

This is an ERC-20 token that anybody can mine by **Proof-of-Work** using Keccak256 with **dynamic difficulty**. It uses **Non-Interactive Zero-Knowledge Proofs** to exchange value between a service running on the Internet and a client. The client doesn't need to disclose any information about its identity. The server only needs to disclose **an Ethereum address** it wants to receive tokens on. There are two modes of exchange, non-interactive (faster but riskier) and interactive (slower but safer). Once a server accumulated enough proofs, it can exchange them against fresh tokens. Any client can **buy tokens** on the secondary market to use the service without mining. There is an automatic algorithmic **halving**.

## Motivation

Let's suppose you want to prevent spam and also want to monetize a service running on Internet.

## Exchange

Let's suppose Alice, the client, wants a service from Bob, the server. Alice asks Bob what's his Ethereum address, his preferred chainID, and the number of tokens he wants for that service.

Alice --- "Hey Bob, what's your address and how much tokens do you want?" ---> Bob
Alice <--- "My address is 0x... on Ethereum and I want at minimum 100 tokens" --- Bob

Once Alice knows those three things, she can start mining tokens (from milliseconds to seconds depending on the difficulty). Once she found a solution to some cryptographic problem, her proof is ready to be sent to Bob.

### Non-interactive exchange

When we want a fast exchange and we already know Bob's parameters, Alice just sends Bob her full proof, that's it. And then Bob can offer the service.

Alice --- "Hey Bob, here is the money" ---> Bob
Alice <--- "Thanks, here is your service" --- Bob

Now Bob can offer the service. At the end of the day, Bob claims tokens with all the proofs he earned.

### Interactive exchange

But what if Bob doesn't offer the service after Alice paid? This can be problematic if Bob is an anonymous node on a peer-to-peer network. We can solve this by using ZKP. Alice will send a ZKP proof to Bob, proving that she has mined a solution, without revealing it.

Alice --- "Hey Bob, here is a proof that I found a solution" ---> Bob
Alice <--- "Thanks, here is the service" --- Bob

After the service successfully done, Alice can reveal the full proof in order for Bob to be paid.

Alice --- "Thanks, here is the money" ---> Bob

At the end of the day, Bob claims tokens with all the proofs he earned. Unfortunately, Alice can leave without giving Bob the full proof, but she won't earn nothing doing that, as she already lost computation power.

### Repeated exchange

To ensure both parties act correctly, we can repeat the exchange multiple times to smoothen the risk of fraud. If the service is continuous, this exchange can be done every X minutes for example.

Alice <--- "You have one minute left to pay my service or I will interrupt it" --- Bob
Alice --- "Ok, here is your money for the next 5 minutes" ---> Bob

If the service is not continuous, like for example an LLM answering a question, Bob can only reveal parts of the data until he gets the money, and Alice can send only some proofs until she gets the data. 

Alice --- "Here is the money for the first part" ---> Bob
Alice <--- "Thanks, here is the first part, send me the money for the second part once you're ready" --- Bob

Since the difficuly is dynamic, proofs are "fungible", 2 proofs worth 1 token is the same as 1 proof worth 2 tokens. Alice can compute a list of proofs at the start of the exchange, and only reveal them gradually.

Alice --- "Here is a ZKP that I found 10 different solutions" --- Bob
Alice <--- "Thanks, let's start the exchange and reveal the proofs every minute" --- Bob

### Escrowed exchange

If the exchange is not continuous and can't be divided into multiple parts, there can be another entity, Carol, that both Alice and Bob trust. Carol will receive the proofs from Alice and the service from Bob. Once Carol received everything, she finishes the exchange by sending the proofs to Bob and the service to Alice.

Alice --- "Hey Carol, here is the money" ---> Carol
Carol --- "Here is a ZKP that I or Alice have the money" ---> Bob
Carol <--- "Thanks, here is the service" --- Bob
Carol --- "Here is the money from Alice" ---> Bob
Alice <--- "Here is the service from Bob" --- Carol

Of course, Carol can be rewarded for her service too! And since Alice and Bob trust her, there won't be any more issue.




