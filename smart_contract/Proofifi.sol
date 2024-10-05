// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Proofifi is ERC721, ERC721Enumerable {
    uint256 private _nextTokenId;
    
    struct TokenData {
        string title;
        string description;
    }

    mapping(uint256 => TokenData) public _tokenData;

    constructor()
        ERC721("Proofifi", "PFF")
    {}

    function safeMint(address to, string memory title, string memory description) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // Store the title and description in the TokenData struct
        _tokenData[tokenId] = TokenData({title: title, description: description});
    }

    function safeMint(address to) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
