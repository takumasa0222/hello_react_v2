import { Construct } from 'constructs';
import { BaseS3Bucket } from '../../interfaces/base-s3-construct';
import { StageStackProps } from '../../types/stack-props';
import { S3 as S3_CONST } from '../../constants/s3.constants';

export class BackendCodeS3Construct extends BaseS3Bucket {
    constructor(scope: Construct, id: string, props: StageStackProps) {
        super(scope, id, { ...props, purpose: S3_CONST.REPO, versioned: true });
    }
}
