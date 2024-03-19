//如果没有安装小狐狸，跳转下载页面
export const checkMetaMaskDownload = () => {
  if (!window.ethereum) {
    // 打下载页面
    window.open('https://metamask.io/', '_blank')
  } else {
    console.log('yes install')
  }
}
