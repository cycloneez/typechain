import * as CryptoJS from "crypto-js"; // 暗号化ライブラリー

/**
 * Block Class
 */
class Block {
  // Hash計算
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  // 構造チェック
  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  public index: number; // index
  public hash: string; // hash
  public previousHash: string; // 以前hash
  public data: string; // データ
  public timestamp: number; // タイムスタンプ

  // コンストラクタ
  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const firstBlock: Block = new Block(0, "101010", "", "hello", 123456);

let blockchain: Block[] = [firstBlock];

const getBlockchain = (): Block[] => blockchain;

// 最後のblobk取得
const getlatestBlock = (): Block => {
  let block = getBlockchain();
  return block[block.length - 1];
};

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 100);

/**
 * 新たなBlock生成
 * @param data: string - データ
 * @return newBlock: Block
 */
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getlatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimeStamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimeStamp,
    data
  );

  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimeStamp
  );

  addBlock(newBlock);
  return newBlock;
};

const getHashforBlock = (block: Block): string =>
  Block.calculateBlockHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.data
  );

const isBlockValid = (candidataBlock: Block, previousBlock: Block): boolean => {
  let isvalid = true;

  if (!Block.validateStructure(candidataBlock)) {
    // check type
    isvalid = false;
  } else if (previousBlock.index + 1 !== candidataBlock.index) {
    // previousBlock check
    isvalid = false;
  } else if (previousBlock.hash !== candidataBlock.previousHash) {
    // prev and cur hash check
    isvalid = false;
  } else if (getHashforBlock(candidataBlock) !== candidataBlock.hash) {
    // hash check
    isvalid = false;
  }

  return isvalid;
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getlatestBlock())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(getBlockchain());

export {};
