import React from 'react'
import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { Contract } from '@ethersproject/contracts'


const Create = ({ marketplace }) => {
    const [reserve, setReserve] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startPrice, setStartPrice] = useState(0)
    const [closing, setClosing] = useState(1)
    const [nft, setNft] = useState('')
    const [tokenId, setTokenId] = useState(0)

    const createListing = async () => {
        if (!name || !description || !reserve || !tokenId) return
        // Add listing to marketplace
        const response = await fetch(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${nft}&apikey=DCV4PCHFIVVYWR83CS48C4J45C9IH8SV93`)
        const metadata = await response.json()
        const nftAbi = metadata.result
        // Get provider from Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Set signer
        const signer = provider.getSigner()
        const nftInstance = new Contract(nft, nftAbi, signer)
        await (await nftInstance.setApprovalForAll(marketplace.address, true)).wait()
        await (await marketplace.createListing(reserve, startPrice, closing, tokenId, nft)).wait()
    }

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
                    <div className="content mx-auto">
                        <h1 className='text-center my-2' > Create an Auction Listing</h1>
                        <Row className="g-4">
                            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                            <Form.Control onChange={(e) => setNft(e.target.value)} size="lg" required type="text" placeholder="NFT Contract" />
                            <Form.Control onChange={(e) => setTokenId(e.target.value)} size="lg" required type="number" placeholder="NFT Token ID" />
                            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                            <Form.Control onChange={(e) => setReserve(e.target.value)} size="lg" required type="number" placeholder="Reserve price in 1/100 ETH" />
                            <Form.Control onChange={(e) => setStartPrice(e.target.value)} size="lg" required type="number" placeholder="Starting price in 1/100 ETH" />
                            <Form.Control onChange={(e) => setClosing(e.target.value)} size="lg" required type="number" placeholder="Auction Length in Days" />
                            <div className="d-grid px-0">
                                <Button onClick={createListing} variant="primary" size="lg">
                                    List your item for auction!
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Create
