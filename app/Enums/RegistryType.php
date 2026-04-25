<?php

namespace App\Enums;

enum RegistryType: string
{
    case Font = 'registry:font';
    case Style = 'registry:style';
    case Hook = 'registry:hook';
    case Ui = 'registry:ui';
    case Lib = 'registry:lib';
}
