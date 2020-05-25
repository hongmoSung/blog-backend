import Post from './model/post';

export default function createFakeData() {
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트 #${i}`,
    body: `absadjskefhakelf  ksdjksaejf.laef i alidj slaeifjefamsd sa fsadiaseflawiejflij kvnxzcv lkjiljefioef ajosijfasiofj`,
    tags: ['넌가짜', '나도가짜'],
  }));
  Post.insertMany(posts, (error, doc) => {
    console.log(doc);
  });
}
