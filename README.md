# Network

An anonymous token to monetize the web with Proof-of-Work

- [All projects](https://github.com/stars/hazae41/lists/network)

## TLDR

You can now monetize any service on the Internet for free — by making people run a PoW algorithm and anonymously send you value in exchange of service

## Use case

- A website that wants to monetize its traffic by making visitors run PoW
- A crypto faucet that makes people run PoW in order to get "free" tokens
- A proxy that wants to monetize its usage by making users run PoW
- A peer-to-peer network that wants to reduce spam
- A free service that wants to reduce spam

## Explain like I'm 5

Let's suppose there is Bob (the server) offering some service to Alice (the client)

- Bob sends his Ethereum address to Alice
- Alice can generate some secrets with the Network algorithm
- Those secrets only have value for Bob because they are tied to his Ethereum address
- The value of a secret is tied to its rarity because of some mathematical stuff
- Alice generates multiple secrets until one of them has some expected value
- The higher the value Alice seeks, the longer it will take her to generate it
- Alice can send her secrets to Bob without disclosing any more information (she is fully anonymous)
- Alice can generate a proof that she has a secret of some value without actually sending it to Bob
- Bob can filter and only accept secrets or proofs with at least some value (e.g. Alice must send at least 2 apples to get 1 pear)
- Or it can simply offer service according to the value of the secret or proof (e.g. Alice sent 10 apples so she will get 10 pears)
- Bob can exchange all its secrets to get tokens by claiming them on the blockchain
- The number of created tokens should remain constant over time even if computers get faster
- Bob can sell tokens on Uniswap to get real money and Alice can buy tokens on Uniswap with real money
- Alice can send tokens to Bob in order to get the same service without generating secrets and paying electricity

## Algorithm

See [implementation](https://github.com/hazae41/network-contracts)

## Exchange

Let's suppose Alice, the client, wants a service from Bob, the server. Alice asks Bob what's his Ethereum address, his preferred chainID, and the number of tokens he wants for that service.

Alice --- "Hey Bob, what's your address and how much tokens do you want?" ---> Bob

Alice <--- "My address is 0x... on Ethereum and I want at minimum 100 tokens" --- Bob

Once Alice knows those three things, she can start mining tokens (from milliseconds to seconds depending on the number of tokens). Once she found a solution to some cryptographic problem, her proof is ready to be sent to Bob.

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




