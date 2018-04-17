﻿// <copyright file="AddHardwareFactorOptions.cs" company="Okta, Inc">
// Copyright (c) Okta, Inc. All rights reserved.
// Licensed under the Apache 2.0 license. See the LICENSE file in the project root for full license information.
// </copyright>

using System;
using System.Collections.Generic;
using System.Text;

namespace Okta.Sdk
{
    public sealed class AddHardwareFactorOptions
    {
        public string PassCode { get; set; }

        public FactorProvider Provider { get; set; }
    }
}