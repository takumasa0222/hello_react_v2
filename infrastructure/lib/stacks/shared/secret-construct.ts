import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { StageStackProps } from '../../interfaces/stack-props';
import { SECRET } from '../../constants/secret.constants';
import { createResourceName } from '../../utils/naming';

export interface SecretProps extends StageStackProps {
  username: string;
  resourcename: string;
}

export class SecretConstruct extends Construct {
  public readonly secret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: SecretProps) {
    super(scope, id);
	const secretname = createResourceName(props.appname,props.resourcename, props.stage);
    this.secret = new secretsmanager.Secret(this, secretname, {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: props.username }),
        generateStringKey: SECRET.BASE_PASSNAME,
        excludeCharacters: SECRET.DEFULT_EXLUDE_CHAR,
      },
    });
  }
}
