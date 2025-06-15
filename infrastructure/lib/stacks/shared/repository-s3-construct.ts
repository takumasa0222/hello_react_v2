import { Construct } from 'constructs';
import { BaseS3Bucket } from '../../interfaces/base-s3-construct';
import { StageStackProps } from '../../interfaces/stack-props';
import { S3 as S3_CONST } from '../../constants/s3.constants';
import { STAGES } from '../../constants';

export class BackendCodeS3Construct extends BaseS3Bucket {
    constructor(scope: Construct, id: string, props: StageStackProps) {
        super(scope, id, { ...props, purpose: S3_CONST.REPO, versioned: props.stage === STAGES.PROD });
    }
}
