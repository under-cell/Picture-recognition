const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const predictionList = document.getElementById('prediction-list');

let model;

// 加载 MobileNet 模型
async function loadModel() {
    console.log('正在加载 MobileNet 模型...');
    try {
        model = await mobilenet.load();
        console.log('模型加载成功！');
        predictionList.innerHTML = '<li>模型已加载，请上传图片。</li>';
    } catch (error) {
        console.error('模型加载失败:', error);
        predictionList.innerHTML = '<li>模型加载失败，请检查网络连接或控制台错误。</li>';
    }
}

// 对图像进行分类
async function classifyImage(imgElement) {
    if (!model) {
        console.log('模型尚未加载。');
        predictionList.innerHTML = '<li>模型正在加载中，请稍候...</li>';
        return;
    }

    console.log('正在进行图像分类...');
    predictionList.innerHTML = '<li>正在分析图片...</li>';

    try {
        // 使用模型进行预测
        const predictions = await model.classify(imgElement);
        console.log('预测结果:', predictions);

        // 显示预测结果
        predictionList.innerHTML = ''; // 清空旧结果
        if (predictions && predictions.length > 0) {
            predictions.forEach(prediction => {
                const listItem = document.createElement('li');
                listItem.textContent = `${prediction.className}: ${(prediction.probability * 100).toFixed(2)}%`;
                predictionList.appendChild(listItem);
            });
        } else {
            predictionList.innerHTML = '<li>无法识别图片内容。</li>';
        }
    } catch (error) {
        console.error('图像分类时出错:', error);
        predictionList.innerHTML = '<li>图像分类时出错，请查看控制台。</li>';
    }
}

// 处理图片上传事件
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            // 图片加载完成后进行分类
            imagePreview.onload = () => classifyImage(imagePreview);
        }
        reader.readAsDataURL(file); // 读取文件内容作为 Data URL
    } else {
        imagePreview.style.display = 'none';
        imagePreview.src = '#';
        predictionList.innerHTML = '<li>请先上传图片...</li>';
    }
});

// 页面加载时自动加载模型
window.onload = loadModel;
