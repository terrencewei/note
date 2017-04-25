package com.terrencewei.markdown.service.impl;

import com.terrencewei.markdown.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.terrencewei.markdown.bean.OSSRequest;
import com.terrencewei.markdown.bean.OSSResponse;
import com.terrencewei.markdown.service.OSSService;
import com.terrencewei.markdown.util.QiniuUtils;

/**
 * Created by terrencewei on 4/21/17.
 */
@Service
public class OSSServiceImpl implements OSSService {

    @Autowired
    private QiniuUtils mQiniuUtils;



    @Override
    public OSSResponse save(OSSRequest pOSSRequest) {
        OSSResponse response = new OSSResponse();
        QiniuUtils.QiniuPutResult result = mQiniuUtils.uploadFile2Cloud(pOSSRequest.getObjData().toString().getBytes(),
                pOSSRequest.getObjKey());
        if (result != null) {
            response.setSuccess(true);
            response.setResponseData(result);
        }
        return response;
    }



    @Override
    public OSSResponse get(OSSRequest pOSSRequest) {
        OSSResponse response = new OSSResponse();
        String downloadUrl = mQiniuUtils.downloadFileFromCloud(pOSSRequest.getObjKey());
        if (StringUtils.isNotBlank(downloadUrl)) {

            response.setSuccess(true);
            response.setResponseData(downloadUrl);
        }
        return response;
    }



    @Override
    public OSSResponse getAll() {
        OSSResponse response = new OSSResponse();
        QiniuUtils.QiniuGetAllResult result = mQiniuUtils.getAllFilesFromCloud();
        if (result != null) {
            response.setSuccess(true);
            response.setResponseData(result);
        }
        return response;
    }
}
